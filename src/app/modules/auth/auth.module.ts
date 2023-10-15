import { NgModule } from '@angular/core';
import { AuthModalComponent } from './author-modal/auth-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../utils/ui/input/input.component';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { ModalBaseComponent } from '../../utils/ui/modal-base/modal-base.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    InputComponent,
    ButtonComponent,
    ModalBaseComponent,
    ReactiveFormsModule,
  ],
  providers: [AuthGuard, AuthService],
})
export class AuthModule {}
