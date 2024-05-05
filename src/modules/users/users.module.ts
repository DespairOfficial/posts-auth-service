import { MailModule } from './../mail/mail.module';
import { PasswordController } from './password/password.controller';
import { DatabaseModule } from './../database/database.module';
import { PasswordService } from './password/password.service';
import { VerificationService } from './verification/verification.service';
import { SessionService } from './session/session.service';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController, PasswordController],
  providers: [UsersService, SessionService, VerificationService, PasswordService],
  exports: [UsersService, SessionService, VerificationService, PasswordService],
  imports: [forwardRef(() => AuthModule), DatabaseModule, MailModule],
})
export class UsersModule {}
