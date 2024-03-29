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

  verifyEmailTryAgain(email: string) {
    return this.http.post<IApiResult<null>>('/api/Auth/RequestForVerifyEmail', {
      email,
    });
  }

  passwordRecovery(email: string) {
    return this.http.post<IApiResult<null>>('/api/Auth/RequestForRecoveryPassword', {
      email,
    });
  }

  checkPasswordChangeToken(token: string) {
    return this.http.get('/api/auth/password/check/' + token);
  }

  passwordChange(email: string, code: string, password: string, confirmPassword: string) {
    return this.http.post<IApiResult<null>>(
      '/api/Auth/RecoveryPassword',
      { email, code, password, confirmPassword }
    );
  }
}
