import { PrismaService } from './../../database/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { NO_EMAIL_CODE, WRONG_EMAIL_CODE } from '../../../config/constants';

@Injectable()
export class VerificationService {
  constructor(private readonly prismaService: PrismaService) {}

  private userRepository = this.prismaService.user;
  private verificationRepository = this.prismaService.verification;

  async setForgotPasswordToken(email: string, forgotPasswordCode: string) {
    await this.userRepository.findUniqueOrThrow({
      where: { email },
    });

    await this.verificationRepository.upsert({
      where: {
        email,
      },
      create: { email, forgotPasswordCode },
      update: { forgotPasswordCode },
    });
    return forgotPasswordCode;
  }

  async verifyPasswordForgotCode(email: string, forgotPasswordCode: string) {
    const user = await this.userRepository.findUniqueOrThrow({
      where: { email },
    });

    const forgotPasswordCodeInDB = await this.verificationRepository.findFirstOrThrow({
      where: {
        email,
      },
    });
    if (!forgotPasswordCodeInDB.forgotPasswordCode) {
      throw new BadRequestException(NO_EMAIL_CODE);
    }
    if (forgotPasswordCodeInDB.forgotPasswordCode === forgotPasswordCode) {
      await this.verificationRepository.update({
        where: {
          email,
        },
        data: {
          forgotPasswordCode: null,
        },
      });
      return user;
    }
    throw new BadRequestException(WRONG_EMAIL_CODE);
  }

  async setEmailVerificationCode(email: string, emailVerificationCode: string) {
    await this.verificationRepository.upsert({
      where: {
        email,
      },
      create: {
        email,
        emailVerificationCode,
      },
      update: {
        emailVerificationCode,
      },
    });
    return emailVerificationCode;
  }

  async verifyEmailVerificationCode(email: string, emailVerificationCode: string) {
    const verificationRow = await this.verificationRepository.findFirstOrThrow({
      where: {
        email,
      },
    });
    if (!verificationRow.emailVerificationCode) {
      throw new BadRequestException(NO_EMAIL_CODE);
    }
    if (verificationRow.emailVerificationCode === emailVerificationCode) {
      await this.verificationRepository.update({
        where: {
          email,
        },
        data: {
          emailVerificationCode: null,
        },
      });
      return true;
    }
    throw new BadRequestException(WRONG_EMAIL_CODE);
  }
}
