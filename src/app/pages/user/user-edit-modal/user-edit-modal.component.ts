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
import { IUserEditData } from './models/user-edit-data.interface';
import { Subject, takeUntil } from 'rxjs';
import { userInputConfigs } from './models/user-edit-data.config';

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
    private dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IUserEditData
  ) {
    this.form = new FormGroup({
      name: new FormControl(data?.name || '', Validators.required),
      lastName: new FormControl(data?.lastName || '', Validators.required),
      img: new FormControl(data?.img || ''),
    });
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: IUserEditData) => {
        this.isEdit =
          this.data.name !== value.name ||
          this.data.lastName !== value.lastName ||
          this.data?.img !== value.img;
      });
  }

  onPhotoChange() {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.form.get('img')?.patchValue(event.target!.result);
    };
    reader.readAsDataURL(this.photo.nativeElement.files![0]);
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
