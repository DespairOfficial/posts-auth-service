import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Verification } from '@prisma/client';

export class VerificationEntity implements Verification {
  @ApiProperty({
    example: '132d213d',
  })
  @IsString()
  readonly forgotPasswordCode: string;

  @ApiProperty({
    example: '96sdf',
  })
  @IsString()
  readonly emailVerificationCode: string;

  @ApiProperty({
    example: 'user@mail.com',
  })
  @IsString()
  readonly email: string;
}
