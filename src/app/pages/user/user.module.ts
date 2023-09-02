import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserRouterModule } from './user-router.module';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../ui/button.component';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, UserRouterModule, MatButtonModule, ButtonComponent],
})
export class UserModule {}
