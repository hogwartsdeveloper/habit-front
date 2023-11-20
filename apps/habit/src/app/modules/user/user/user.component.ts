import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'ui';

import { HabitService } from '../../habit/services/habit.service';
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';
import { IHabits } from '../../habit/models/habits.interface';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { UserEditAvatarModalComponent } from '../user-edit-avatar-modal/user-edit-avatar-modal.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  habits: IHabits = { active: [], history: [] };
  destroy$ = new Subject();
  loading = signal(true);

  constructor(
    private readonly dialog: MatDialog,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    public readonly habitService: HabitService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(
        switchMap((user) => {
          this.user = user!;

          return this.habitService.get(user?.id!);
        }),
        tap(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe((habits) => (this.habits = habits));
  }

  openEditModal() {
    this.dialog.open(UserEditModalComponent, {
      width: '400px',
      height: '300px',
      panelClass: 'noBackground',
      autoFocus: false,
      data: this.user,
    });
  }

  onSelectedAvatar(files: FileList | null) {
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
          user: this.user,
          uploadableImg: event.target!.result,
        },
      });
    };

    reader.readAsDataURL(files[0]);
  }

  removeImg() {
    this.userService.deleteImg(this.user.id).subscribe(() => {
      this.messageService.success('Изображения успешно удалено');
    });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
