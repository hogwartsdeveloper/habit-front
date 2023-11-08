import { Component, signal } from '@angular/core';
import { IInput } from '../../../utils/ui/input/models/input.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent {
  configs = signal<IInput[]>([
    {
      title: 'Password',
      required: true,
      type: 'password',
      fName: 'password',
    },
    {
      title: 'Confirm password',
      required: true,
      type: 'password',
      fName: 'confirmPassword',
    },
  ]);

  form = signal<FormGroup>(
    new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    })
  );
  email = signal<string>('jannuraidynuly@gmail.com');
}
