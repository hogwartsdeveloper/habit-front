import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { verifyEmailGuard } from '../../guard/verify-email.guard';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';

const routes: Routes = [
  {
    path: 'verifyEmail',
    component: VerifyEmailComponent,
    canActivate: [verifyEmailGuard],
  },
  { path: 'password_reset', component: PasswordResetComponent },
  { path: 'password_change', component: PasswordChangeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {}
