import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from '@nestjs/class-validator';

export class BrowserHeadersDto {
  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    description: 'User agent of browser',
  })
  @IsString({ message: 'Cannot be used without browser' })
  readonly userAgent: string;

  @ApiProperty({
    example: '1ab-23',
    description: 'Header - fingerprint of browser',
  })
  @IsString({ message: 'Cannot be used without browser' })
  readonly fingerprint: string;

  @ApiProperty({
    example: '127.0.0.1',
    description: 'IP address',
  })
  @IsOptional()
  @IsString({ message: 'Cannot be used without browser' })
  readonly ip: string;
}
