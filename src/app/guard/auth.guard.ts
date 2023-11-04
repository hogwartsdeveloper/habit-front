import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, take } from 'rxjs';

import { ThreeSupportService } from '../services/three-support.service';
import { UserService } from '../modules/user/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly threeSupportService: ThreeSupportService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.user$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          return this.router.createUrlTree(['/']);
        }
        return true;
      })
    );
  }
}
