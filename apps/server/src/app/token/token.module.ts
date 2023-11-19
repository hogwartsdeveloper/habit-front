import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokenService } from './token.service';
import { getJWTConfig } from '../config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJWTConfig
    })
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
