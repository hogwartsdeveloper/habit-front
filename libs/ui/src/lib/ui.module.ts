import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadComponent } from './load/load.component';
import { ResultComponent } from './result/result.component';
import { InputModule } from './input/input.module';

@NgModule({
  imports: [CommonModule, LoadComponent, ResultComponent, InputModule],
  exports: [LoadComponent, ResultComponent, InputModule],
})
export class UiModule {}
