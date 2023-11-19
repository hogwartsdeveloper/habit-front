import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async create(payload: object, exp: number, options?: JwtSignOptions) {
    return this.jwtService.signAsync({ ...payload, exp }, options);
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }

  async verify(token: string, secret?: string) {
    return this.jwtService.verifyAsync(token, { secret });
  }
}
