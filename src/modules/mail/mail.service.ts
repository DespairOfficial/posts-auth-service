import { NodeMailerService } from './nodemailer.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MailService {
  constructor(private readonly nodeMailerService: NodeMailerService) {}

  async sendForgotPassword(email: string, token: string) {
    await this.nodeMailerService.sendForgotPassword(email, token);
  }

  async sendEmailConfirmationCode(email: string, code: string) {
    await this.nodeMailerService.sendEmailConfirmationCode(email, code);
  }
}
