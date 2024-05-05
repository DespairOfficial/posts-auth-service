import { UserEntity } from './../entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsIP, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateUserDto extends PickType(UserEntity, ['email', 'firstName']) {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user, unique ',
  })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Must be email' })
  readonly email: string;

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: '192.168.0.1',
  })
  @IsIP()
  @IsString()
  ip: string;
}
