import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  AuthUser,
  CreateUser,
  VerifyEmail,
} from '../../user/model/user.interface';
import { IAuth } from '../models/author.model';

@Injectable()
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  authorization(user: AuthUser) {
    return this.http.post<IAuth>('/api/auth/login', user);
  }

  registration(user: CreateUser) {
    return this.http.post<{ result: string }>('/api/auth/registration', user);
  }

  updateToken() {
    return this.http.get<IAuth>('/api/auth/updateToken');
  }

  verifyEmail(verifyData: VerifyEmail) {
    return this.http.post<IAuth>('/api/auth/verify/email', verifyData);
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

  passwordChange(token: string, password: string) {
    return this.http.post<{ result: string }>(
      '/api/auth/password/change/' + token,
      { password }
    );
  }
}
