import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from '@nestjs/class-validator';

export class LogInUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user, unique ',
  })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Must be email' })
  readonly email: string;

  @ApiProperty({
    example: 'asdf_1s!@41$#afafg9',
    description: 'Password. Stored in hased form',
  })
  @IsString({ message: 'Must be string' })
  @Length(6, 24, {
    message: 'Can not be shorter than 6 symbols',
  })
  readonly password: string;
}
