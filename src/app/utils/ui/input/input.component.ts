import { Component, Input } from '@angular/core';
import { IInput } from './models/input.interface';
import { NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [NgIf, ReactiveFormsModule],
})
export class InputComponent {
  @Input({ required: true }) config: IInput;
  @Input({ required: true }) form: FormGroup;
}
