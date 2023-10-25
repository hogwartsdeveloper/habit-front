import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
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
  @ViewChild('photoInput', { static: true })
  photo: ElementRef<HTMLInputElement>;
  userInputConfigs = userInputConfigs;
  form: FormGroup;
  isEdit = false;
  destroy$ = new Subject();

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
      img: new FormControl(''),
    });
  }

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.isEdit =
        this.data.firstName !== value.firstName ||
        this.data.lastName !== value.lastName;
    });
  }

  onPhotoChange() {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.form.get('img')?.patchValue(event.target!.result);
    };
    reader.readAsDataURL(this.photo.nativeElement.files![0]);
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    this.userService
      .update(this.data.id, this.form.getRawValue())
      .pipe(take(1))
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
