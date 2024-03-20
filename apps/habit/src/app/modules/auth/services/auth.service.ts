import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, of, switchMap, take} from 'rxjs';
import {MessageService} from 'ui';

import {IAuth} from '../models/author.model';
import {User} from '../../user/model/user';
import {UserService} from '../../user/services/user.service';
import {AuthApiService} from './auth-api.service';
import {API_TOKEN} from '../constants/auth.constant';
import {LAST_URL} from '../../../constants/app.constant';

@Injectable()
export class AuthService {
  updateTokenInterval: ReturnType<typeof setInterval>;

  constructor(
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly authApiService: AuthApiService
  ) {}

  autoLogin() {
    const token = localStorage.getItem(API_TOKEN);
    if (!token) return;
    this.login(token);
  }

  autoUpdateToken(exp: number) {
    this.clearIntervals();
    this.updateTokenInterval = setInterval(() => {
      this.authApiService
        .refreshToken()
        .pipe(
          switchMap(res => {
            if (res.result) {
              return this.catchToken(res.result)
            }
            return of(null);
          }),
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
      this.login(res.accessToken);
      return of(true);
    }

    return of(null);
  }

  checkRegistration(msg: string) {
    this.router
      .navigate(['/auth/verifyEmail'], {
        replaceUrl: true,
      })
      .then(() => {
        this.messageService.success(msg);
      });
  }

  checkVerify() {
    const verify = sessionStorage.getItem('verifyEmail');
    if (verify) {
      this.checkRegistration(
        'Завершите подтверждение email'
      );
    }
  }

  login(token: string) {
    const parseToken = this.parseJWT(token);

    localStorage.setItem(API_TOKEN, token);

    this.userService
      .getUser()
      .pipe(
        switchMap((res) => {
          if (res.result) {
            const user = res.result;

            const newUser = new User(
              user.email,
              user.firstName,
              user.lastName,
              user.isEmailConfirmed,
              token,
              parseToken.exp,
              user.birthDay,
              user.imageUrl
            );

            return of(newUser);
          }

          return of(null);
        }),
        take(1)
      )
      .subscribe((user) => {
        if (!user) return;

        this.userService.user$.next(user);

        const exp = user.tokenExpired * 1000 - Date.now();
        this.autoUpdateToken(exp - 10000);
        this.lastRoute();
      });
  }

  logout() {
    this.userService.user$.next(null);
    localStorage.removeItem(API_TOKEN);
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

  lastRoute() {
    const url = localStorage.getItem(LAST_URL);
    if (url) {
      this.router.navigate([url]);
      return;
    }
    this.router.navigate(['/change']);
  }
}
