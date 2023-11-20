import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take, tap } from 'rxjs';
import { MessageService } from 'ui';

import { IInput } from '../../../utils/ui/input/models/input.interface';
import { AuthApiService } from '../services/auth-api.service';
import { AuthService } from '../services/auth.service';
import { VerifyEmail } from '../../user/model/user.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  config = signal<IInput>({
    title: 'Enter code',
    required: true,
    type: 'code',
    fName: 'code',
  });

  form = signal<FormGroup>(
    new FormGroup({
      code: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4),
      ]),
    })
  );

  email = signal<string>('');
  userData = sessionStorage.getItem('verifyEmail');
  loading = signal(true);

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authApiService: AuthApiService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((map) => {
        if (map.has('email')) {
          this.email.set(map.get('email')!);
        }
      });

    this.formCode?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value.length === 4) {
          this.verifyEmail({ ...JSON.parse(this.userData!), code: +value });
        }
      });

    this.loading.set(false);
  }

  get formCode() {
    return this.form().get(this.config().fName);
  }

  verifyEmail(verifyData: VerifyEmail) {
    this.loading.set(true);
    this.authApiService
      .verifyEmail(verifyData)
      .pipe(
        switchMap((res) => this.authService.catchToken(res)),
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((res) => {
        if (res) {
          this.messageService.success('Вы зарегистрировались');
          sessionStorage.removeItem('verifyEmail');
        }
      });
  }

  tryAgain() {
    this.authApiService
      .verifyEmailTryAgain({ ...JSON.parse(this.userData!) })
      .pipe(take(1))
      .subscribe((res) => {
        this.messageService.success(res.result);
      });
  }
}
