import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { verifyEmailGuard } from '../../guard/verify-email.guard';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { passwordChangeGuard } from '../../guard/password-change.guard';

const routes: Routes = [
  {
    path: 'verifyEmail',
    component: VerifyEmailComponent,
    canActivate: [verifyEmailGuard],
  },
  { path: 'password_reset', component: PasswordResetComponent },
  {
    path: 'password_change/:token',
    component: PasswordChangeComponent,
    canActivate: [passwordChangeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {}
