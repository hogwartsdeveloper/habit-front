import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap, take, tap } from 'rxjs';

import { AuthorType } from '../models/author.model';
import { ThreeSupportService } from '../../../services/three-support.service';
import { IInput } from '../../../utils/ui/input/models/input.interface';
import { authInputConfigs } from './form.config';
import { AuthApiService } from '../services/auth-api.service';
import { AuthService } from '../services/auth.service';
import { emailExistValidator } from '../../../utils/validators/email-exist.validator';
import { emailNotExistValidator } from '../../../utils/validators/email-not-exist.validator';

@Component({
  selector: 'app-author-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit {
  type: AuthorType = 'signIn';
  form: FormGroup;
  configs: IInput[] = authInputConfigs;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { type: AuthorType },
    private readonly dialogRef: MatDialogRef<AuthModalComponent>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly authApiService: AuthApiService,
    private readonly authService: AuthService,
    private readonly threeSupportService: ThreeSupportService
  ) {
    this.type = data?.type || 'signIn';

    switch (this.type) {
      case 'signIn':
        this.form = new FormGroup({
          email: new FormControl(
            '',
            [Validators.required, Validators.email],
            [emailExistValidator()]
          ),
          password: new FormControl('', [Validators.required]),
        });
        break;
      case 'signUp':
        this.form = new FormGroup({
          email: new FormControl(
            '',
            [Validators.required, Validators.email],
            [emailNotExistValidator()]
          ),
          password: new FormControl('', [Validators.required]),
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
        });
    }
  }

  ngOnInit() {
    this.threeSupportService.stopAnimation$.next(true);
  }

  openLogin(type: AuthorType = 'signIn') {
    this.dialogRef.close();
    this.dialog.open(AuthModalComponent, {
      width: '400px',
      height: type === 'signIn' ? '350px' : '500px',
      panelClass: 'noBackground',
      data: {
        type,
      },
    });
  }

  sign(type: AuthorType) {
    const user = { ...this.form.getRawValue() };
    switch (type) {
      case 'signUp':
        this.authApiService
          .registration(user)
          .pipe(
            tap((res) => this.authService.checkRegistration(user, res.result)),
            take(1)
          )
          .subscribe((res) => {
            if (res) {
              this.dialogRef.close();
            }
          });
        break;
      case 'signIn':
        this.authApiService
          .authorization(user)
          .pipe(
            switchMap((res) => this.authService.catchToken(res)),
            take(1)
          )
          .subscribe((res) => {
            if (res) {
              this.dialogRef.close();
            }
          });
    }
  }
}
