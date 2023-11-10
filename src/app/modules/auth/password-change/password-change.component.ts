import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';

import { IInput } from '../../../utils/ui/input/models/input.interface';
import { AuthApiService } from '../services/auth-api.service';
import { ActivatedRoute } from '@angular/router';

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
  token: string;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authApiService: AuthApiService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!;

    this.form()
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((values) => {
        this.isPasswordCoincide.set(values.password === values.confirmPassword);
      });
  }

  save() {
    this.authApiService
      .passwordChange(this.token, this.form().get('password')?.value)
      .pipe(take(1))
      .subscribe();
  }
}
