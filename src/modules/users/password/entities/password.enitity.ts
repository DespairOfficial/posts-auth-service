import { UUID_V7_EXAMPLE } from './../../../../config/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Password } from '@prisma/client';

export class PasswordEntity implements Password {
  @ApiProperty({
    example: UUID_V7_EXAMPLE,
    description: 'Id of a user',
  })
  userId: string;

  @ApiProperty({
    example: 'asdf896sadf00sdf',
    description: 'Salt of a password',
  })
  salt: string;

  @ApiProperty({
    example: 'asdf_1s!@41$#afafg9',
    description: 'Password. Stored in hased form',
  })
  readonly password: string;
}
