import { UUID_V7_EXAMPLE } from './../../../config/constants';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserInfoDto extends PickType(UserEntity, ['id', 'image', 'email', 'firstName', 'email', 'lastName']) {
  @ApiProperty({
    example: UUID_V7_EXAMPLE,
    description: 'Id of user',
  })
  id: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    example: 'users/o8u34gfoisydfasdf-me.jpg',
    description: 'image of profile',
  })
  image: string;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;
}
