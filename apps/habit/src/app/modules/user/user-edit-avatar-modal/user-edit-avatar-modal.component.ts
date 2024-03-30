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
import Cropper from 'cropperjs';
import { MessageService } from 'ui';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { FileService } from '../../../services/file.service';

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
    private readonly messageService: MessageService,
    private readonly fileService: FileService
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

  async onSave() {
    this.loading.set(true);

    const croppedImgURL = this.cropper
      .getCroppedCanvas()
      .toDataURL('image/png');

    const fileName = (this.userService.user$.value?.email ?? '') + '.png';
    const file = await this.fileService.convertBase64toFile(
      croppedImgURL,
      fileName,
      'image/png'
    );

    this.userService
      .uploadImg(file)
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe(() => {
        const user = this.userService.user$.value;
        if (user) {
          user.imageUrl = 'user/' + fileName;
          this.userService.user$.next(user);
        }
        this.messageService.success('Изображение загружено!');
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
