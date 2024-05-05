import { UserEntity } from './../entities/user.entity';
import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(UserEntity, ['id', 'password', 'email']) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'Image from Form-Data',
    description: 'Image of a user',
    required: false,
  })
  @IsOptional()
  image: string;

  @ApiProperty({
    example: 'John',
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsOptional()
  lastName: string;
}
