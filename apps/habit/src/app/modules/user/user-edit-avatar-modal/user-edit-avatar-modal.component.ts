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
import { UserService } from '../services/user.service';
import { take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-edit-avatar',
  templateUrl: './user-edit-avatar-modal.component.html',
  styleUrls: ['user-edit-avatar-modal.component.scss'],
})
export class UserEditAvatarModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('image') img: ElementRef<HTMLImageElement>;
  cropper: Cropper;
  imgURL: string;

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
    const croppedImgURL = this.cropper
      .getCroppedCanvas()
      .toDataURL('image/png');

    this.userService
      .uploadImg(this.data.user.id, croppedImgURL)
      .pipe(take(1))
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
