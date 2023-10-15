import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthorType } from '../models/author.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThreeSupportService } from '../../../services/three-support.service';
import { IInput } from '../../../utils/ui/input/models/input.interface';
import { authInputConfigs } from './form.config';
import { take } from 'rxjs';

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
    private dialogRef: MatDialogRef<AuthModalComponent>,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private threeSupportService: ThreeSupportService
  ) {
    this.type = data?.type || 'signIn';

    switch (this.type) {
      case 'signIn':
        this.form = new FormGroup({
          email: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
        });
        break;
      case 'signUp':
        this.form = new FormGroup({
          email: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
          firstName: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required),
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
    switch (type) {
      case 'signUp':
        this.authService
          .registration({ ...this.form.getRawValue() })
          .pipe(take(1))
          .subscribe((res) => {
            if (res) {
              this.dialogRef.close();
            }
          });
        break;
      case 'signIn':
        this.authService
          .auth({ ...this.form.getRawValue() })
          .pipe(take(1))
          .subscribe((res) => {
            if (res) {
              this.dialogRef.close();
            }
          });
    }
  }
}
