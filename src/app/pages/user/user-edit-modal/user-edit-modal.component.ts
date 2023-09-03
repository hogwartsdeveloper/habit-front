import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUserEditData } from './models/user-edit-data.interface';
import { Subject, takeUntil } from 'rxjs';
import { userInputConfigs } from './models/user-edit-data.config';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModalComponent implements OnInit, OnDestroy {
  userInputConfigs = userInputConfigs;
  form: FormGroup;
  isEdit = false;
  destroy$ = new Subject();

  constructor(
    private dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IUserEditData
  ) {
    this.form = new FormGroup({
      name: new FormControl(data?.name || '', Validators.required),
      lastName: new FormControl(data?.lastName || '', Validators.required),
    });
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: IUserEditData) => {
        this.isEdit =
          this.data.name !== value.name ||
          this.data.lastName !== value.lastName;
      });
  }

  onClose(content: IUserEditData | null = null) {
    this.dialogRef.close(content);
  }

  onSave() {
    this.onClose(this.form.getRawValue());
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
