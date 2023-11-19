import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerifyService } from './verify/verify.service';
import { Verify, VerifySchema } from './verify/verify.model';
import { VerifyController } from './verify/verify.controller';
import { PasswordService } from './password/password.service';
import { PasswordController } from './password/password.controller';
import { PasswordRecovery, PasswordRecoverySchema } from './password/password-recovery.model';
import { TokenModule } from '../token/token.module';
import { AuthTokenService } from './auth-token.service';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verify.name, schema: VerifySchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema }
    ]),
    TokenModule,
    EmailModule
  ],
  controllers: [AuthController, VerifyController, PasswordController],
  providers: [AuthService, VerifyService, PasswordService, AuthTokenService],
  exports: [AuthService]
})
export class AuthModule {}
