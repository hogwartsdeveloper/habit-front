import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const user = this.authService.user$.value;
    if (user && user.token) {
      const modifiedReq = req.clone({
        headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`),
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
