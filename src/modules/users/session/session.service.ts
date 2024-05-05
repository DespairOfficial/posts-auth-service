import { PrismaService } from './../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Token } from '../../../interfaces/Token.interface';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly sessionRepository = this.prismaService.session;

  async findOneByRefreshToken(refreshToken: Token) {
    const session = await this.sessionRepository.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    return session;
  }

  async findOneByFingerPrint(fingerprint: string) {
    const session = await this.sessionRepository.findFirst({
      where: {
        fingerprint,
      },
    });
    return session;
  }

  async deleteSessionByRefreshToken(refreshToken: Token) {
    await this.sessionRepository.delete({
      where: {
        refreshToken,
      },
    });
  }

  async create(userId: string, createSessionDto: CreateSessionDto) {
    const session = await this.sessionRepository.create({
      data: {
        userId,
        ...createSessionDto,
      },
    });
    return session;
  }
}
