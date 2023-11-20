import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { userInputConfigs } from './models/user-edit-data.config';
import { UserService } from '../services/user.service';
import { UpdateUser } from '../model/user.interface';

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
  loading = signal(false);

  constructor(
    private readonly dialogRef: MatDialogRef<UserEditModalComponent>,
    private readonly userService: UserService,
    private readonly messageService: NzMessageService,
    private readonly translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public readonly data: UpdateUser & { id: string }
  ) {
    this.form = new FormGroup({
      firstName: new FormControl(data?.firstName || '', Validators.required),
      lastName: new FormControl(data?.lastName || '', Validators.required),
    });
  }

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.isEdit =
        this.data.firstName !== value.firstName ||
        this.data.lastName !== value.lastName;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    this.loading.set(true);
    this.userService
      .update(this.data.id, this.form.getRawValue())
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe(() => {
        this.messageService.success(
          this.translateService.instant('base.successEdit')
        );
        this.onClose();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
