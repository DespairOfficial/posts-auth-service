import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NodeMailerService } from './nodemailer.service';

@Module({
  imports: [],
  providers: [MailService, NodeMailerService],
  exports: [MailService],
})
export class MailModule {}
