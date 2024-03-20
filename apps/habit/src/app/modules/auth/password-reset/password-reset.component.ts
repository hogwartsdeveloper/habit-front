import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take, tap } from 'rxjs';

import {IInput, MessageService} from 'ui';
import {AuthApiService} from '../services/auth-api.service';
import {Router} from "@angular/router";

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
      ),
    })
  );

  loading = signal(false);

  constructor(
    private readonly authApiService: AuthApiService,
    private readonly messageService: MessageService,
    private readonly router: Router) {}

  sent() {
    this.loading.set(true);
    this.authApiService
      .passwordRecovery(this.form().getRawValue().email)
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((res) => {
        const email = this.form().get('email')?.value

        if (res.isSuccess) {
          this.messageService.success("В почту отправлени код. Код может находится в спам.")
          this.router.navigate(["/password_change/" + email])
        }
      });
  }
}
