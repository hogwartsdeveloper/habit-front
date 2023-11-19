import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadComponent } from './load/load.component';

@NgModule({
  imports: [CommonModule, LoadComponent],
  exports: [LoadComponent],
})
export class UiModule {}
