import { HashedString } from '../../interfaces/HashedString.interface';
import { PrismaService } from './../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly usersRepository = this.prismaService.user;

  async create(createUserDto: CreateUserDto, hashedPassword: HashedString): Promise<User> {
    const user = this.usersRepository.create({
      data: {
        ...createUserDto,
        password: {
          create: {
            password: hashedPassword.hash,
            salt: hashedPassword.salt,
          },
        },
      },
    });

    return user;
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findFirst({
      where: {
        email,
      },
    });
  }

  async findByIp(ip: string): Promise<User> {
    return this.usersRepository.findFirst({
      where: {
        ip,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findMany();
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.usersRepository.delete({ where: { id } });
    return deletedUser;
  }
}
