import { SessionEntity } from './../users/session/entities/sesstion.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { accessTokenOptions, refreshTokenOptions } from '../../config/jwtOptions';
import { ERROR_CREATING_SESSION } from '../../config/constants';
import { Token } from '../../interfaces/Token.interface';
import { SessionService } from '../users/session/session.service';
import { User } from '@prisma/client';
import { BrowserHeadersDto } from '../users/session/dto/browser-headers.dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}
  private readonly logger = new Logger(TokenService.name);
  private generateAccessToken(user: User): Token {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'access_token',
    };
    return this.jwtService.sign(payload);
  }

  async upsertTokensAndSession(user: User, browserDataDto: BrowserHeadersDto, oldRefreshToken?: Token) {
    const accessToken: Token = this.generateAccessToken(user);
    const expiresAt = this.getNewExpiresAtForAccessToken();
    let session: SessionEntity;
    try {
      if (oldRefreshToken) {
        await this.sessionService.deleteSessionByRefreshToken(oldRefreshToken);
      }
      session = await this.sessionService.create(user.id, {
        ...browserDataDto,
        expiresAt,
      });
      return {
        accessToken,
        refreshToken: session.refreshToken,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ERROR_CREATING_SESSION);
    }
  }

  public getNewExpiresAtForAccessToken(): Date {
    return new Date(Date.now() + accessTokenOptions.expiresIn * 1000);
  }

  public getNewExpiresAtForRefreshToken(): Date {
    return new Date(Date.now() + refreshTokenOptions.expiresIn * 1000);
  }
}
