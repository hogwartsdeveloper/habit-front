import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

import { IAuth } from '../models/author.model';
import { User } from '../../user/model/user';
import { CreateUser } from '../../user/model/user.interface';
import { UserService } from '../../user/services/user.service';
import { AuthApiService } from './auth-api.service';

@Injectable()
export class AuthService {
  updateTokenInterval: ReturnType<typeof setInterval>;

  constructor(
    private readonly http: HttpClient,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly authApiService: AuthApiService
  ) {}

  autoLogin() {
    const userStore = localStorage.getItem('user');
    if (!userStore) return;

    const userParse = JSON.parse(userStore);
    this.login(userParse?._token);
  }

  autoUpdateToken(exp: number) {
    this.clearIntervals();
    this.updateTokenInterval = setInterval(() => {
      this.authApiService
        .updateToken()
        .pipe(
          catchError(() => {
            this.logout();
            return of(null);
          }),
          take(1)
        )
        .subscribe((res) => {
          if (!res) {
            this.logout();
          }
        });
    }, exp);
  }

  catchToken(res: IAuth | null) {
    if (res) {
      this.login(res.token);
      return of(true);
    }

    return of(null);
  }

  checkRegistration(user: CreateUser, msg: string) {
    this.router
      .navigate(['/auth/verifyEmail'], {
        queryParams: { email: user.email },
        replaceUrl: true,
      })
      .then(() => {
        this.messageService.success(msg);
        sessionStorage.setItem('verifyEmail', user.email);
      });
  }

  login(token: string) {
    const payload = this.parseJWT(token);
    const user = new User(
      payload._id,
      payload.email,
      payload.firstName,
      payload.lastName,
      payload.img,
      token,
      payload.exp
    );

    if (!user.token) {
      this.logout();
      return;
    }

    this.userService.user$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/change']);
    this.autoUpdateToken(payload.exp - Date.now() - 60000);
  }

  logout() {
    this.userService.user$.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
    this.clearIntervals();
  }

  parseJWT(token: string) {
    const base64URL = token.split('.')[1];
    const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  clearIntervals() {
    clearInterval(this.updateTokenInterval);
  }
}
