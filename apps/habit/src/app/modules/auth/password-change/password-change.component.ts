import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, take, tap } from 'rxjs';

import { IInput } from '../../../utils/ui/input/models/input.interface';
import { AuthApiService } from '../services/auth-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
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
  isPasswordCoincide = signal<boolean>(false);
  loading = signal<boolean>(true);
  token: string;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly authApiService: AuthApiService,
    private readonly messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!;
    const payload = this.authService.parseJWT(this.token);
    if (payload?.email) {
      this.email.set(payload?.email);
    }

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
    this.authApiService
      .passwordChange(this.token, this.form().get('password')?.value)
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe(() => {
        this.messageService.success('Password changed!');
        this.router.navigate(['/']);
      });
  }
}
