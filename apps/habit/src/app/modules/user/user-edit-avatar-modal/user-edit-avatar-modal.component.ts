import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import Cropper from 'cropperjs';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-edit-avatar',
  templateUrl: './user-edit-avatar-modal.component.html',
  styleUrls: ['user-edit-avatar-modal.component.scss'],
})
export class UserEditAvatarModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('image') img: ElementRef<HTMLImageElement>;
  cropper: Cropper;
  imgURL: string;
  loading = signal(false);

  constructor(
    private readonly dialogRef: MatDialogRef<UserEditAvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: { user: User; uploadableImg: string },
    private readonly userService: UserService,
    private readonly messageService: NzMessageService
  ) {
    this.imgURL = this.data.uploadableImg;
  }

  ngAfterViewInit() {
    this.cropper = new Cropper(this.img.nativeElement, {
      aspectRatio: 1,
      viewMode: 1,
      zoomable: false,
    });
  }

  onSave() {
    this.loading.set(true);
    const croppedImgURL = this.cropper
      .getCroppedCanvas()
      .toDataURL('image/png');

    this.userService
      .uploadImg(this.data.user.id, croppedImgURL)
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe(() => {
        this.messageService.success('Image uploaded!');
        this.onClose();
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.cropper.destroy();
  }
}
