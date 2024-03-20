import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {take, tap} from 'rxjs';
import {IInput, MessageService} from 'ui';

import {AuthApiService} from '../services/auth-api.service';
import {VerifyEmail} from '../../user/model/user.interface';
import {UserService} from "../../user/services/user.service";

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
    private readonly router: Router,
    private readonly authApiService: AuthApiService,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        if (user) {
          this.email.set(user?.email);
        }
      })

    this.formCode?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value.length === 4) {
          this.verifyEmail({ email: this.email(), code: value });
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
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.success('Вы подтвердили почту!');
          sessionStorage.removeItem('verifyEmail');
          this.router.navigate(['/change']);
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
