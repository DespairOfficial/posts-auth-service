import { PrismaService } from './../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { Password } from '@prisma/client';
import { HashedString } from '../../../interfaces/HashedString.interface';

@Injectable()
export class PasswordService {
  constructor(private readonly prismaService: PrismaService) {}

  private passwordRepository = this.prismaService.password;
  // async create(
  //   userId: string,
  //   password: string,
  //   salt: string,
  // ): Promise<Password> {
  //   const passwordObject = await this.passwordRepository.create({
  //     where: {
  //       userId,
  //       password,
  //       salt,
  //     },
  //   });
  //   return passwordObject;
  // }

  async findOneByUserId(userId: string): Promise<Password> {
    return this.passwordRepository.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  }

  async updatePassword(userId: string, newPassword: string) {
    const newHashedPassword = await this.hash(newPassword);
    await this.passwordRepository.update({
      where: {
        userId,
      },
      data: {
        password: newHashedPassword.hash,
        salt: newHashedPassword.salt,
      },
    });
  }

  async hash(password: string) {
    return new Promise<HashedString>((resolve, reject) => {
      const salt = randomBytes(Math.floor(Math.random() * 64 + 64)).toString('hex');
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve({
          salt,
          hash: derivedKey.toString('hex'),
        });
      });
    });
  }

  async compare(password: string, salt: string, hashedPassword: string) {
    const candidate = new Promise<string>((resolve, reject) => {
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(derivedKey.toString('hex'));
      });
    });

    return candidate.then((value) => {
      return value === hashedPassword;
    });
  }
}
