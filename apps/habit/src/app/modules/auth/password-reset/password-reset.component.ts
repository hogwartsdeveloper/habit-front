import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take, tap } from 'rxjs';

import { IInput } from 'ui';
import { AuthApiService } from '../services/auth-api.service';
import { emailExistValidator } from '../../../utils/validators/email-exist.validator';

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
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        [emailExistValidator()]
      ),
    })
  );

  isSent = signal<boolean>(false);
  loading = signal(false);

  constructor(private readonly authApiService: AuthApiService) {}

  sent() {
    this.loading.set(true);
    this.authApiService
      .passwordRecovery(this.form().getRawValue().email)
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe(() => {
        this.isSent.set(true);
      });
  }
}
