import { CanActivateFn } from '@angular/router';

export const verifyEmailGuard: CanActivateFn = () => {
  return !!sessionStorage.getItem('verifyEmail');
};
