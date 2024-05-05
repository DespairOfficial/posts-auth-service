import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { BrowserHeadersDto } from '../users/session/dto/browser-headers.dto';
import { Body, Controller, Post, Req, UseGuards, Res, Patch, Get, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LogInUserDto } from './dto/log-in-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenService } from './token.service';
import { CustomHeaders } from '../../decorators/headers.decorator';
import AuthResult from '../../interfaces/AuthResult.interface';
import { refreshCookieOptions } from '../../config/cookieOptions';
import { Token } from '../../interfaces/Token.interface';
import { COOKIES_NOT_SET, EMAIL_CODE_SENT, JWT_TOKEN_EXAMPLE } from '../../config/constants';
import { Tokens } from '../../interfaces/Tokens.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({
    status: 201,
    type: AuthResponseDto,
  })
  @Post('login')
  async logIn(
    @CustomHeaders() headers: BrowserHeadersDto,
    @Req() request: Request,
    @Body() logInUserDto: LogInUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authData: AuthResult = await this.authService.login(logInUserDto, headers);
    const expires = this.tokenService.getNewExpiresAtForRefreshToken();
    res.cookie('refreshToken', authData.tokens.refreshToken, {
      ...refreshCookieOptions,
      expires: expires,
    });
    return { user: authData.user, accessToken: authData.tokens.accessToken };
  }

  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({
    status: 201,
  })
  @Post('emailVerification')
  async emailVerification(@Body() sendEmailCodeDto: SendEmailCodeDto) {
    await this.authService.sendEmailVerificationCode(sendEmailCodeDto);
    return { message: EMAIL_CODE_SENT };
  }

  @ApiOperation({ summary: 'Sign Up/Registration ' })
  @ApiResponse({
    status: 201,
    type: AuthResponseDto,
  })
  @Post('register')
  async register(
    @CustomHeaders()
    headers: BrowserHeadersDto,
    @Req() request: Request,
    @Body() userDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authData: AuthResult = await this.authService.register(userDto, headers);
    const expires = this.tokenService.getNewExpiresAtForRefreshToken();
    res.cookie('refreshToken', authData.tokens.refreshToken, {
      ...refreshCookieOptions,
      expires: expires,
    });
    return { user: authData.user, accessToken: authData.tokens.accessToken };
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiResponse({
    status: 201,
  })
  @Patch('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const cookiesHeader = request.headers.cookie;

    const cookies = this.authService.parseCookies(cookiesHeader);

    const refreshToken: Token = cookies.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    request.user = undefined;
    res.clearCookie('refreshToken');
  }

  @ApiOperation({
    summary: 'Create new access token, and update refresh token',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        accessToken: JWT_TOKEN_EXAMPLE,
      },
    },
  })
  @Get('refreshToken')
  async refreshToken(
    @Req() request: Request,
    @CustomHeaders() headers: BrowserHeadersDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookiesHeader = request.headers.cookie;

    if (!cookiesHeader) {
      throw new UnauthorizedException(COOKIES_NOT_SET);
    }

    const cookies = this.authService.parseCookies(cookiesHeader);

    const refreshToken: Token = cookies.refreshToken;

    const tokens: Tokens = await this.authService.refresh(refreshToken, headers);
    const expires = this.tokenService.getNewExpiresAtForRefreshToken();
    res.cookie('refreshToken', tokens.refreshToken, {
      ...refreshCookieOptions,
      expires: expires,
    });
    return { accessToken: tokens.accessToken };
  }

  @Get('init')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns user instanse' })
  async init(@Req() request: Request) {
    const user = await this.usersService.findOne(request.user.id);
    return user;
  }
}
