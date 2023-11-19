import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { UserDocument } from '../user/user.model';
import { IAuthToken } from './dto/auth-token.interface';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
  ) {}

  async createTokensForAuth(user: UserDocument): Promise<IAuthToken> {
    const payload = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      img: user.img,
    };

    const result: IAuthToken = {
      accessToken: await this.tokenService.create(payload, Date.now() + 60000 * 15),

      refreshToken: await this.tokenService.create(
        { email: payload.email },
        Date.now() + 86400000 * 19,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      ),
    };

    user.refreshToken = result.refreshToken;
    await user.save();

    return result;
  }

  saveCookie(tokens: IAuthToken, response: Response) {
    response.cookie('token', tokens.refreshToken);

    return { token: tokens.accessToken };
  }
}
