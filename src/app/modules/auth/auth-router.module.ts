import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { verifyEmailGuard } from '../../guard/verify-email.guard';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  {
    path: 'verifyEmail',
    component: VerifyEmailComponent,
    canActivate: [verifyEmailGuard],
  },
  { path: 'password_reset', component: PasswordResetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {}
