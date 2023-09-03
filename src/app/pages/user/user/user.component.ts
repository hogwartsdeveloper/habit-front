import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { IUser } from '../model/user.interface';
import { Subject, take, takeUntil } from 'rxjs';
import { IHabit } from '../../habit/models/habit.interface';
import { HabitService } from '../../habit/services/habit.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';
import { IUserEditData } from '../user-edit-modal/models/user-edit-data.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: IUser;
  habits: IHabit[];
  destroy$ = new Subject();
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    public habitService: HabitService
  ) {}

  ngOnInit() {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));

    this.habitService.habits$
      .pipe(take(1))
      .subscribe((habits) => (this.habits = habits));
  }

  openEditModal() {
    this.dialog
      .open(UserEditModalComponent, {
        width: '400px',
        height: '350px',
        panelClass: 'noBackground',
        autoFocus: false,
        data: {
          name: this.user.firstName,
          lastName: this.user.lastName,
        },
      })
      .beforeClosed()
      .subscribe((value: IUserEditData) => {
        if (value) {
          this.authService.user$.next({
            ...this.user,
            firstName: value.name,
            lastName: value.lastName,
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
