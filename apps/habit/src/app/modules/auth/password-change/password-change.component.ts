import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, take, tap } from 'rxjs';
import { IInput, MessageService } from 'ui';

import { AuthApiService } from '../services/auth-api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
  configs = signal<IInput[]>([
    {
      title: 'Введите код',
      required: true,
      type: 'code',
      fName: 'code'
    },
    {
      title: 'Пароль',
      required: true,
      type: 'password',
      fName: 'password',
    },
    {
      title: 'Подтверждения пароля',
      required: true,
      type: 'password',
      fName: 'confirmPassword',
    },
  ]);

  form = signal<FormGroup>(
    new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4),
      ]),
    })
  );
  email = signal<string>("");
  isPasswordCoincide = signal<boolean>(false);
  loading = signal<boolean>(true);
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authApiService: AuthApiService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    const email = this.route.snapshot.paramMap.get('email')!;
    this.email.set(email);

    this.form()
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((values) => {
        this.isPasswordCoincide.set(values.password === values.confirmPassword);
      });

    this.loading.set(false);
  }

  save() {
    this.loading.set(true);
    const code = this.form().get('code')?.value;
    console.log(code)
    const password = this.form().get('password')?.value;
    const confirmPassword = this.form().get('confirmPassword')?.value

    this.authApiService
      .passwordChange(this.email(), code, password, confirmPassword)
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe(() => {
        this.messageService.success('Password changed!');
        this.router.navigate(['/']);
        sessionStorage.removeItem('lastUrl');
      });
  }
}
