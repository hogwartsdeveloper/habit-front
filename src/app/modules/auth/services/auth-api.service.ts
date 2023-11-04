import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';

import {
  AuthUser,
  CreateUser,
  VerifyEmail,
} from '../../user/model/user.interface';
import { IAuth } from '../models/author.model';
import { AuthService } from './auth.service';

@Injectable()
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  authorization(user: AuthUser) {
    return this.http
      .post<IAuth>('/api/auth/login', user)
      .pipe(switchMap((res) => this.authService.catchToken(res)));
  }

  registration(user: CreateUser) {
    return this.http
      .post<{ result: string }>('/api/auth/registration', user)
      .pipe(tap((res) => this.authService.checkRegistration(user, res.result)));
  }

  updateToken() {
    return this.http
      .get<IAuth>('/api/auth/updateToken')
      .pipe(switchMap((res) => this.authService.catchToken(res)));
  }

  verifyEmail(verifyData: VerifyEmail) {
    return this.http
      .post<IAuth>('/api/auth/verify/email', verifyData)
      .pipe(switchMap((res) => this.authService.catchToken(res)));
  }
}
