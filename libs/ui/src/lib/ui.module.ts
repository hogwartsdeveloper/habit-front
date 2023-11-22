import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadComponent } from './load/load.component';
import { ResultComponent } from './result/result.component';
import { InputModule } from './input/input.module';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,
    LoadComponent,
    ResultComponent,
    InputModule,
    AvatarComponent,
  ],
  exports: [LoadComponent, ResultComponent, InputModule, AvatarComponent],
})
export class UiModule {}
