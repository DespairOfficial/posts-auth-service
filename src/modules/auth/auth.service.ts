import { PasswordService } from './../users/password/password.service';
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { VerificationService } from '../users/verification/verification.service';
import AuthResult from '../../interfaces/AuthResult.interface';
import { SessionService } from '../users/session/session.service';
import { TokenService } from './token.service';
import { LogInUserDto } from './dto/log-in-user.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Token } from '../../interfaces/Token.interface';
import { Tokens } from '../../interfaces/Tokens.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  EMAIL_EXISTS,
  REFRESH_MALFORMED,
  REFRESH_NOT_FOUND,
  WRONG_EMAIL_CODE,
  WRONG_EMAIL_OR_PASSWORD,
} from '../../config/constants';
import { User } from '@prisma/client';
import { BrowserHeadersDto } from '../users/session/dto/browser-headers.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private verificationService: VerificationService,
    private mailService: MailService,
    private passwordService: PasswordService,
  ) {}
  private async validateLogin(userDto: LogInUserDto): Promise<User> {
    const user = await this.usersService.findByEmail(userDto.email);
    if (user) {
      const userPassword = await this.passwordService.findOneByUserId(user.id);
      const isPasswordValid = await this.passwordService.compare(
        userDto.password,
        userPassword.salt,
        userPassword.password,
      );
      if (isPasswordValid) {
        return user;
      }
    }
    throw new UnauthorizedException({
      message: WRONG_EMAIL_OR_PASSWORD,
    });
  }

  async login(logInUserDto: LogInUserDto, browserDataDto: BrowserHeadersDto): Promise<AuthResult> {
    const user: User = await this.validateLogin(logInUserDto);

    const session = await this.sessionService.findOneByFingerPrint(browserDataDto.fingerprint);

    const tokens = await this.tokenService.upsertTokensAndSession(user, browserDataDto, session?.refreshToken);

    return { user: user, tokens };
  }

  async register(registerUserDto: RegisterUserDto, browserDataDto: BrowserHeadersDto): Promise<AuthResult> {
    const candidate: User = await this.usersService.findByEmail(registerUserDto.email);
    if (candidate) {
      throw new BadRequestException(EMAIL_EXISTS);
    }

    // const userWithIp: User = await this.usersService.findByIp(browserDataDto.ip);
    // if (userWithIp) {
    //   throw new BadRequestException(IP_EXISTS + ': ' + userWithIp.email);
    // }

    const isVerified = await this.verificationService.verifyEmailVerificationCode(
      registerUserDto.email,
      registerUserDto.emailVerificationCode,
    );

    if (!isVerified) {
      throw new BadRequestException(WRONG_EMAIL_CODE);
    }

    const userDto: CreateUserDto = {
      email: registerUserDto.email,
      firstName: registerUserDto.firstName,
      lastName: registerUserDto.lastName,
      ip: browserDataDto.ip,
    };

    const password = registerUserDto.password;

    const hashedPassword = await this.passwordService.hash(password);

    const user: User = await this.usersService.create(userDto, hashedPassword);
    const session = await this.sessionService.findOneByFingerPrint(browserDataDto.fingerprint);

    const tokens = await this.tokenService.upsertTokensAndSession(user, browserDataDto, session?.refreshToken);

    return { user, tokens };
  }

  async logout(refreshToken: Token) {
    await this.sessionService.deleteSessionByRefreshToken(refreshToken);
  }

  async refresh(refreshToken: Token, browserDataDto: BrowserHeadersDto): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException(REFRESH_NOT_FOUND);
    }
    const sessionDataFromDb = await this.sessionService.findOneByRefreshToken(refreshToken);

    if (!sessionDataFromDb) {
      throw new UnauthorizedException(REFRESH_MALFORMED);
    }
    const user = await this.usersService.findOne(sessionDataFromDb.userId);
    const tokens = await this.tokenService.upsertTokensAndSession(user, browserDataDto, refreshToken);

    return tokens;
  }

  async sendEmailVerificationCode(sendEmailCodeDto: SendEmailCodeDto) {
    const user = await this.usersService.findByEmail(sendEmailCodeDto.email);

    if (user) {
      throw new BadRequestException(EMAIL_EXISTS);
    }

    const codeBuffer = randomBytes(5);
    const code = codeBuffer.toString('hex');

    const genedatedCode = await this.verificationService.setEmailVerificationCode(sendEmailCodeDto.email, code);
    await this.mailService.sendEmailConfirmationCode(sendEmailCodeDto.email, genedatedCode);
  }

  parseCookies(cookiesHeader: string) {
    const cookiesStrings = cookiesHeader.split(' ');
    const cookies: { [key: string]: string } = {};
    cookiesStrings.forEach((cookie) => {
      const keyValue = cookie.split('=');
      cookies[keyValue[0]] = keyValue[1].split(';')[0];
    });
    return cookies;
  }
}
