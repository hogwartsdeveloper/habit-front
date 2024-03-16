import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from './input.component';
import { InputCodeComponent } from './input-code/input-code.component';

@NgModule({
  declarations: [InputComponent, InputCodeComponent],
  exports: [InputComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class InputModule {}
