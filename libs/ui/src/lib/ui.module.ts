import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadComponent } from './load/load.component';
import { ResultComponent } from './result/result.component';

@NgModule({
  imports: [CommonModule, LoadComponent, ResultComponent],
  exports: [LoadComponent, ResultComponent],
})
export class UiModule {}
