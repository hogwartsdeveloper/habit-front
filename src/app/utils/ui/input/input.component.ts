import { Component, Input } from '@angular/core';
import { IInput } from './models/input.interface';
import { NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [NgIf, ReactiveFormsModule, TranslateModule],
})
export class InputComponent {
  @Input({ required: true }) config: IInput;
  @Input({ required: true }) form: FormGroup;
}
