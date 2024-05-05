import { UUID_V7_EXAMPLE } from './../../../config/constants';
import { PasswordEntity } from './../password/entities/password.enitity';
import { $Enums, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({
    example: UUID_V7_EXAMPLE,
    description: 'Id of user',
  })
  id: string;

  @ApiProperty({
    example: 'users/asdfasdasfg-img1.png',
    description: 'Path to image',
  })
  image: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    example: '192.168.0.1',
    description: 'IP, that user used to perform registration',
  })
  ip: string;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    example: 5200,
  })
  usedTokens: number;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date;

  // ApiProperty does not work here with SWC
  role: $Enums.Role;

  @ApiProperty({
    type: PasswordEntity,
  })
  password: PasswordEntity;
}
