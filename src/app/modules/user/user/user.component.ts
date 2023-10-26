import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  constructor(
    private readonly dialog: MatDialog,
    private readonly message: NzMessageService,
    private readonly translateService: TranslateService,
    public readonly habitService: HabitService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user!;
      this.habitService
        .get(this.user.id)
        .pipe(take(1))
        .subscribe((habits) => (this.habits = habits));
    });
  }

  openEditModal() {
    this.dialog.open(UserEditModalComponent, {
      width: '400px',
      height: '600px',
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
        height: '600px',
        panelClass: 'noBackground',
        autoFocus: false,
      });
    };

    reader.readAsDataURL(files[0]);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
