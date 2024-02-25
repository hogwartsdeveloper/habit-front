import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem("api-token");
    if (token) {
      const modifiedReq = req.clone({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
