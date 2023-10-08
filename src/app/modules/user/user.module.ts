import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserRouterModule } from './user-router.module';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component';
import { InputComponent } from '../../utils/ui/input/input.component';
import { ModalBaseComponent } from '../../utils/ui/modal-base/modal-base.component';
import { TranslateModule } from '@ngx-translate/core';
import { HabitViewModule } from '../habit/habit-view/habit-view.module';

@NgModule({
  declarations: [UserComponent, UserEditModalComponent],
  imports: [
    CommonModule,
    UserRouterModule,
    MatButtonModule,
    ButtonComponent,
    InputComponent,
    ModalBaseComponent,
    HabitViewModule,
    TranslateModule,
  ],
})
export class UserModule {}
