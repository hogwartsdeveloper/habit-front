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
import { AvatarComponent } from '../../utils/ui/avatar/avatar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UserEditAvatarModalComponent } from './user-edit-avatar-modal/user-edit-avatar-modal.component';

@NgModule({
  declarations: [
    UserComponent,
    UserEditModalComponent,
    UserEditAvatarModalComponent,
  ],
  imports: [
    CommonModule,
    UserRouterModule,
    MatButtonModule,
    ButtonComponent,
    InputComponent,
    ModalBaseComponent,
    HabitViewModule,
    TranslateModule,
    AvatarComponent,
    NzIconModule,
    NzDropDownModule,
  ],
})
export class UserModule {}
