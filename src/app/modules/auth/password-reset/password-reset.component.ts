import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { IInput } from '../../../utils/ui/input/models/input.interface';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  config = signal<IInput>({
    title: 'Email',
    required: true,
    type: 'email',
    fName: 'email',
  });

  form = signal<FormGroup>(
    new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    })
  );

  isSent = signal<boolean>(false);

  constructor(private readonly authApiService: AuthApiService) {}

  sent() {
    this.authApiService
      .passwordRecovery(this.form().getRawValue().email)
      .pipe(take(1))
      .subscribe(() => this.isSent.set(true));
  }
}
