import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AuthModalComponent } from './author-modal/auth-modal.component';
import { InputComponent } from '../../utils/ui/input/input.component';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { ModalBaseComponent } from '../../utils/ui/modal-base/modal-base.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthRouterModule } from './auth-router.module';

@NgModule({
  declarations: [AuthModalComponent, VerifyEmailComponent],
  imports: [
    CommonModule,
    TranslateModule,
    InputComponent,
    ButtonComponent,
    ModalBaseComponent,
    ReactiveFormsModule,
    AuthRouterModule,
  ],
})
export class AuthModule {}
