import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  HabitCalendarStatus,
  IHabit,
  IHabitCalendar,
} from '../models/habit.interface';
import { HabitService } from '../services/habit.service';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent {
  weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  today = dayjs().format('YYYY-MM-DD');
  selectedDay: IHabitCalendar | null;
  loading = signal(false);
  readonly HabitCalendarStatus = HabitCalendarStatus;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private message: NzMessageService,
    private translateService: TranslateService,
    private habitService: HabitService,
    @Inject(MAT_DIALOG_DATA)
    public data: IHabit
  ) {}

  onDone(day: IHabitCalendar) {
    this.selectedDay = day;
    if (this.data.lastActiveDate === this.today) {
      this.message.warning(
        this.translateService.instant('habit.message.warningAddRecord')
      );
      this.selectedDay = null;

      return;
    }

    if (day.date === this.today) {
      switch (day.status) {
        case HabitCalendarStatus.Clean:
          day.status = HabitCalendarStatus.Success;
          break;
        case HabitCalendarStatus.Success:
          day.status = HabitCalendarStatus.Danger;
          break;
        case HabitCalendarStatus.Danger:
          day.status = HabitCalendarStatus.Clean;
          break;
      }
    }
  }

  close(payload?: IHabit) {
    this.dialogRef.close(payload);
  }

  save() {
    this.loading.set(true);
    this.habitService
      .addRecord(this.data._id, {
        date: this.selectedDay?.date!,
        status: this.selectedDay?.status!,
      })
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((habit) => {
        this.message.success(
          this.translateService.instant('habit.message.successAddRecord')
        );
        this.close(habit);
      });
  }
}
