import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadComponent } from './load/load.component';
import { ResultComponent } from './result/result.component';
import { InputModule } from './input/input.module';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonComponent } from './button/button.component';
import { ModalBaseComponent } from './modal-base/modal-base.component';
import { KeyboardComponent } from './keyboard/keyboard.component';

@NgModule({
  imports: [
    CommonModule,
    LoadComponent,
    ResultComponent,
    InputModule,
    AvatarComponent,
    ButtonComponent,
    ModalBaseComponent,
    KeyboardComponent,
  ],
  exports: [
    LoadComponent,
    ResultComponent,
    InputModule,
    AvatarComponent,
    ButtonComponent,
    ModalBaseComponent,
    KeyboardComponent,
  ],
})
export class UiModule {}
