import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ThreeSupportService } from '../../services/three-support.service';

@Injectable()
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private threeSupportService: ThreeSupportService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url !== '/') {
      this.threeSupportService.stopAnimation$.next(true);
      this.authService.isAuth$.next(true);
    }
  }
}
