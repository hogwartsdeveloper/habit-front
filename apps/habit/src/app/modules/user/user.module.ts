import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user/user.component';
import {UserRouterModule} from './user-router.module';
import {MatButtonModule} from '@angular/material/button';
import {UserEditModalComponent} from './user-edit-modal/user-edit-modal.component';
import {HabitViewModule} from '../habit/habit-view/habit-view.module';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {UserEditAvatarModalComponent} from './user-edit-avatar-modal/user-edit-avatar-modal.component';
import {AvatarComponent, ButtonComponent, InputModule, LoadComponent, ModalBaseComponent,} from 'ui';

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
    InputModule,
    ModalBaseComponent,
    HabitViewModule,
    AvatarComponent,
    NzIconModule,
    NzDropDownModule,
    LoadComponent,
  ]
})
export class UserModule {}
