import { UUID_V7_EXAMPLE } from './../../../../config/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsISO8601, IsString } from '@nestjs/class-validator';

export class UpdateSessionDto {
  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    description: 'User agent of browser',
  })
  @IsString()
  readonly userAgent: string;

  @ApiProperty({
    example: '1ab-23',
    description: 'Fingerprint of browser',
  })
  @IsString()
  readonly fingerprint: string;

  @ApiProperty({
    example: '192.168.0.1',
    description: 'IP',
  })
  @IsIP(4)
  readonly ip: string;

  @ApiProperty({
    example: UUID_V7_EXAMPLE,
  })
  @IsString()
  readonly refreshToken: string;

  @ApiProperty({
    example: '2023-03-14T10:54:26.561Z',
    description: 'Exites at time ',
  })
  @IsISO8601({ strict: true })
  readonly expiresAt: Date;
}
