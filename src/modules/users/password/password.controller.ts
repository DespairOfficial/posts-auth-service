import { MailService } from './../../mail/mail.service';
import { PasswordService } from './password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { createHmac } from 'crypto';
import { Controller, Patch, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrowserHeadersDto } from '../session/dto/browser-headers.dto';
import { VerificationService } from '../verification/verification.service';
import { CustomHeaders } from '../../../decorators/headers.decorator';
import { EMAIL_CODE_SENT } from '../../../config/constants';

@ApiTags('Password')
@Controller('password')
export class PasswordController {
  constructor(
    private verificationService: VerificationService,
    private passwordService: PasswordService,
    private mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Send email if forgot password' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { message: EMAIL_CODE_SENT },
    },
  })
  @Post('forgot')
  async forgotPassword(@CustomHeaders() headers: BrowserHeadersDto, @Body() forgotPasswordDto: ForgotPasswordDto) {
    const code = createHmac('sha256', process.env.SECRET_FOR_HASH)
      .update(`${new Date()}${headers.fingerprint}${headers.userAgent}`)
      .digest('hex');
    const forgotPasswordCode = await this.verificationService.setForgotPasswordToken(forgotPasswordDto.email, code);
    await this.mailService.sendForgotPassword(forgotPasswordDto.email, forgotPasswordCode);
    return { message: EMAIL_CODE_SENT };
  }

  @ApiOperation({ summary: 'Restore password' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { message: 'Password was changed!' },
    },
  })
  @Patch('restore')
  async restorePassword(@CustomHeaders() headers: BrowserHeadersDto, @Body() restorePasswordDto: RestorePasswordDto) {
    const { email, password, restorePasswordHash } = restorePasswordDto;
    const user = await this.verificationService.verifyPasswordForgotCode(email, restorePasswordHash);
    if (user) {
      this.passwordService.updatePassword(user.id, password);
      return { message: 'Password was changed!' };
    }
  }
}
