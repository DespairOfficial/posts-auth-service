import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { emailConfirmation, forgotPassword } from './htmlTemplates';
@Injectable()
export class NodeMailerService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  private logger = new Logger(NodeMailerService.name);

  async sendForgotPassword(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/password/restore/${token}?email=${email}`;

    try {
      await this.transporter.sendMail({
        to: email,
        from: `AV <${process.env.MAIL_USER}>`, // override default from
        subject: 'Password restoration',
        html: forgotPassword(url),
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async sendEmailConfirmationCode(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        to: email,
        from: `AV <${process.env.MAIL_USER}>`, // override default from
        subject: 'Email confirmation',
        html: emailConfirmation(email, code),
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
