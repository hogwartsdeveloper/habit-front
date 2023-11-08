import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AuthModalComponent } from './author-modal/auth-modal.component';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { ModalBaseComponent } from '../../utils/ui/modal-base/modal-base.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthRouterModule } from './auth-router.module';
import { InputModule } from '../../utils/ui/input/input.module';
import { AuthApiService } from './services/auth-api.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NzResultModule } from 'ng-zorro-antd/result';
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
    TranslateModule,
    InputModule,
    ButtonComponent,
    ModalBaseComponent,
    ReactiveFormsModule,
    AuthRouterModule,
    NzResultModule,
  ],
  providers: [AuthApiService],
})
export class AuthModule {}
