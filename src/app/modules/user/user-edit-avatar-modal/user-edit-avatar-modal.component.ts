import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Cropper from 'cropperjs';
import { User } from '../model/user';

@Component({
  selector: 'app-user-edit-avatar',
  templateUrl: './user-edit-avatar-modal.component.html',
  styleUrls: ['user-edit-avatar-modal.component.scss'],
})
export class UserEditAvatarModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('image') img: ElementRef<HTMLImageElement>;
  cropper: Cropper;

  constructor(
    private readonly dialogRef: MatDialogRef<UserEditAvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: { user: User; uploadableImg: string }
  ) {}

  ngAfterViewInit() {
    this.cropper = new Cropper(this.img.nativeElement, {
      aspectRatio: 1,
      viewMode: 1,
      zoomable: false,
      crop: () => {},
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.cropper.destroy();
  }
}
