import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({
      url: environment.apiUrl + req.url
    });

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
