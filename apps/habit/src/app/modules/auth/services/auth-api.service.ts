import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  AuthUser,
  CreateUser,
  VerifyEmail,
} from '../../user/model/user.interface';
import { IAuth } from '../models/author.model';
import {IApiResult} from "../../../shared/models/api-result";

@Injectable()
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  authorization(user: AuthUser) {
    return this.http.post<IApiResult<IAuth>>('/api/Auth/SignIn', user);
  }

  registration(user: CreateUser) {
    return this.http.post<IApiResult<IAuth>>('/api/Auth/SignUp', user);
  }

  refreshToken() {
    return this.http.get<IApiResult<IAuth>>('/api/Auth/Refresh')
  }

  verifyEmail(verifyData: VerifyEmail) {
    return this.http.post<IApiResult<IAuth>>('/api/Auth/ConfirmEmail', verifyData);
  }

  verifyEmailTryAgain(user: CreateUser) {
    return this.http.post<{ result: string }>(
      '/api/auth/verify/tryAgain',
      user
    );
  }

  passwordRecovery(email: string) {
    return this.http.post<{ result: string }>('/api/auth/password/recovery', {
      email,
    });
  }

  checkPasswordChangeToken(token: string) {
    return this.http.get('/api/auth/password/check/' + token);
  }

  passwordChange(token: string, password: string) {
    return this.http.post<{ result: string }>(
      '/api/auth/password/change/' + token,
      { password }
    );
  }
}
