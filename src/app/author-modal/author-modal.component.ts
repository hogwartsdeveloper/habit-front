import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthorType } from '../models/author.model';

@Component({
  selector: 'app-author-modal',
  templateUrl: './author-modal.component.html',
  styleUrls: ['./author-modal.component.scss'],
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule, NgIf, NgSwitchCase, NgSwitch],
})
export class AuthorModalComponent {
  type: AuthorType = 'signIn';
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { type: AuthorType },
    private dialogRef: MatDialogRef<AuthorModalComponent>,
    private dialog: MatDialog
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
          name: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required),
        });
    }
  }

  openLogin(type: AuthorType = 'signIn') {
    this.dialogRef.close();
    this.dialog.open(AuthorModalComponent, {
      width: '400px',
      height: type === 'signIn' ? '500px' : '650px',
      panelClass: 'noBackground',
      data: {
        type,
      },
    });
  }
}
