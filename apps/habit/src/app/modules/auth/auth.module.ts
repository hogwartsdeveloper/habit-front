import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  InputModule,
  LoadComponent,
  ModalBaseComponent,
  ResultComponent,
} from 'ui';

import { AuthModalComponent } from './author-modal/auth-modal.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthRouterModule } from './auth-router.module';
import { AuthApiService } from './services/auth-api.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';

@NgModule({
  declarations: [
    AuthModalComponent,
    VerifyEmailComponent,
    PasswordResetComponent,
    PasswordChangeComponent,
  ],
  imports: [
    CommonModule,
    ButtonComponent,
    ModalBaseComponent,
    ReactiveFormsModule,
    AuthRouterModule,
    LoadComponent,
    ResultComponent,
    InputModule,
  ],
  providers: [AuthApiService],
})
export class AuthModule {}
