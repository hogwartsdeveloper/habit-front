import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, take } from 'rxjs';

import { AuthApiService } from '../modules/auth/services/auth-api.service';

export const passwordChangeGuard: CanActivateFn = (route, state) => {
  const authApiService = inject(AuthApiService);
  const token = route.paramMap.get('token');

  if (!token) {
    return false;
  }

  return authApiService.checkPasswordChangeToken(token).pipe(
    map(() => true),
    catchError(() => of(false)),
    take(1)
  );
};
