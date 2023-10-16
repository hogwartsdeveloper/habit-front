import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, take } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

import { AuthUser, CreateUser } from '../../user/model/user.interface';
import { IAuth } from '../models/author.model';
import { User } from '../../user/model/user';

@Injectable()
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);
  updateTokenInterval: ReturnType<typeof setInterval>;

  constructor(
    private readonly http: HttpClient,
    private readonly messageService: NzMessageService,
    private readonly router: Router
  ) {}

  auth(user: AuthUser) {
    return this.http.post<IAuth>('/api/auth/login', user).pipe(
      catchError(this.catchError.bind(this)),
      switchMap((res) => this.catchToken(res))
    );
  }

  autoLogin() {
    const userStore = localStorage.getItem('user');
    if (!userStore) return;

    const userParse = JSON.parse(userStore);
    const user = new User(
      userParse.id,
      userParse.email,
      userParse.firstName,
      userParse.lastName,
      userParse.img,
      userParse._token,
      userParse._tokenExpired
    );

    if (user.token) {
      this.user$.next(user);
      this.router.navigate(['/change']);
      this.autoUpdateToken(userParse._tokenExpired - Date.now() - 60000);
      return;
    }
    this.user$.next(null);
  }

  autoUpdateToken(exp: number) {
    clearInterval(this.updateTokenInterval);
    this.updateTokenInterval = setInterval(() => {
      this.updateToken()
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

  registration(user: CreateUser) {
    return this.http.post<IAuth>('/api/auth/registration', user).pipe(
      catchError(this.catchError.bind(this)),
      switchMap((res) => this.catchToken(res))
    );
  }

  updateToken() {
    return this.http
      .get<IAuth>('/api/auth/updateToken')
      .pipe(switchMap((res) => this.catchToken(res)));
  }

  catchToken(res: IAuth | null) {
    if (res) {
      this.login(res.token);
      return of(true);
    }

    return of(null);
  }

  catchError(err: HttpErrorResponse) {
    this.messageService.error(err?.error?.message);
    return of(null);
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

    this.user$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/change']);
    this.autoUpdateToken(payload.exp - Date.now() - 60000);
  }

  logout() {
    this.user$.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
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

  clearInterval() {
    clearInterval(this.updateTokenInterval);
  }
}
