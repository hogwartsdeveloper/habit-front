import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BehaviorSubject, Subject, take, takeUntil, tap} from 'rxjs';
import { MessageService } from 'ui';

import { HabitService } from '../../habit/services/habit.service';
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';
import { IHabits } from '../../habit/models/habits.interface';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { UserEditAvatarModalComponent } from '../user-edit-avatar-modal/user-edit-avatar-modal.component';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user$: BehaviorSubject<User | null>;
  habits: IHabits;
  destroy$ = new Subject();
  userImgBase64: string = '';
  loading = signal(true);

  constructor(
    private readonly dialog: MatDialog,
    private readonly messageService: MessageService,
    public readonly habitService: HabitService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.getUserImage(user?.imageUrl);
      });
    
    this.habitService
      .getGroup()
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((res) => {
        if (!res.result) return;

        this.habits = res.result;
      });
  }

  openEditModal(user: User) {
    this.dialog.open(UserEditModalComponent, {
      width: '400px',
      height: '300px',
      panelClass: 'noBackground',
      autoFocus: false,
      data: user,
    });
  }

  onSelectedAvatar(user: User, files: FileList | null) {
    if (!files) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      this.dialog.open(UserEditAvatarModalComponent, {
        width: '400px',
        height: '500px',
        panelClass: 'noBackground',
        autoFocus: false,
        disableClose: true,
        data: {
          user: user,
          uploadableImg: event.target!.result,
        },
      });
    };

    reader.readAsDataURL(files[0]);
  }

  removeImg(imgName: string) {
    this.userService
      .deleteImg(imgName)
      .pipe(take(1))
      .subscribe(() => {
        this.messageService.success('Изображения успешно удалено');
      });
  }

  getUserImage(imgUrl?: string) {
    if (!imgUrl) return;

    this.fileService
      .getFile(imgUrl)
      .pipe(take(1))
      .subscribe(async (file) => {
        if (!file) return;
        this.userImgBase64 = await this.fileService.convertFileToBase64(file);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
