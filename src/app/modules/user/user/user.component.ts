import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { IUser } from '../model/user.interface';
import { Subject, take, takeUntil } from 'rxjs';
import { IHabit } from '../../habit/models/habit.interface';
import { HabitService } from '../../habit/services/habit.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';
import { IUserEditData } from '../user-edit-modal/models/user-edit-data.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { IHabits } from '../../habit/models/habits.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: IUser;
  habits: IHabits;
  destroy$ = new Subject();
  constructor(
    private dialog: MatDialog,
    private message: NzMessageService,
    private translateService: TranslateService,
    private authService: AuthService,
    public habitService: HabitService
  ) {}

  ngOnInit() {
    // this.authService.user$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((user) => (this.user = user));

    this.habitService
      .get('651f80fc007ede299e36a86c')
      .pipe(take(1))
      .subscribe((habits) => (this.habits = habits));
  }

  openEditModal() {
    this.dialog
      .open(UserEditModalComponent, {
        width: '400px',
        height: '600px',
        panelClass: 'noBackground',
        autoFocus: false,
        data: {
          name: this.user.firstName,
          lastName: this.user.lastName,
          img: this.user.img,
        },
      })
      .beforeClosed()
      .subscribe((value: IUserEditData) => {
        if (value) {
          // this.authService.user$.next({
          //   ...this.user,
          //   firstName: value.name,
          //   lastName: value.lastName,
          //   img: value.img,
          // });

          this.message.success(
            this.translateService.instant('base.successEdit')
          );
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
