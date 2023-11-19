import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { RegistrationDto } from './dto/registration.dto';
import { AuthDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { VerifyService } from './verify/verify.service';
import { EmailService } from '../email/email.service';
import { REGISTER_EMAIL_MSG_TITLE, REGISTER_RESULT } from './auth.constants';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly authTokenService: AuthTokenService,
    private readonly userService: UserService,
    private readonly verifyService: VerifyService,
    private readonly emailService: EmailService
  ) {}

  async register(dto: RegistrationDto, response: Response) {
    await this.userService.create(dto);
    const verify = await this.verifyService.create(dto.email);

    try {
      await this.emailService.sendMessage(
        dto.email,
        REGISTER_EMAIL_MSG_TITLE,
        verify.code.toString()
      );
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }

    return { result: REGISTER_RESULT };
  }

  async login(dto: AuthDto, response: Response) {
    const user = await this.userService.findByEmail(dto.email);
    await this.userService.checkPassword(dto.password, user.passwordHash);
    const tokens = await this.authTokenService.createTokensForAuth(user);
    return this.authTokenService.saveCookie(tokens, response);
  }

  async updateToken(refreshToken: string, response: Response) {
    const payload = await this.verifyAccessToken(
      refreshToken,
      this.configService.get('JWT_REFRESH_SECRET')
    );

    const user = await this.userService.findByEmail(payload.email);

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authTokenService.createTokensForAuth(user);
    return this.authTokenService.saveCookie(tokens, response);
  }

  async verifyAccessToken(token: string, secret?: string) {
    try {
      return await this.tokenService.verify(token, secret);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
