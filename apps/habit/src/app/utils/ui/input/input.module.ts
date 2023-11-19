import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from './input.component';
import { InputCodeComponent } from './components/input-code.component';

@NgModule({
  declarations: [InputComponent, InputCodeComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  exports: [InputComponent],
})
export class InputModule {}
