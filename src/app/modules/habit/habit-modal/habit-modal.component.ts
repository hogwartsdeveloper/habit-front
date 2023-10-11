import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { take } from 'rxjs';

import { ICalendarDay } from './model/calendar-day.interface';
import { IHabit } from '../models/habit.interface';
import { HabitService } from '../services/habit.service';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent implements OnInit {
  weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  days: ICalendarDay[] = [];
  today = dayjs().format('YYYY-MM-DD');
  selectedDay: ICalendarDay | null;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private message: NzMessageService,
    private translateService: TranslateService,
    private habitService: HabitService,
    @Inject(MAT_DIALOG_DATA)
    public data: IHabit
  ) {}

  ngOnInit() {
    this.habitService
      .getDays(this.data._id)
      .pipe(take(1))
      .subscribe((days) => (this.days = days));
  }

  onDone(day: ICalendarDay) {
    this.selectedDay = day;
    if (this.data.lastActiveDate === this.today) {
      this.message.warning(
        this.translateService.instant('habit.message.warningAddRecord')
      );
      this.selectedDay = null;

      return;
    }

    if (day.fullDate === this.today) {
      switch (day.status) {
        case 'basic':
          day.status = 'add';
          break;
        case 'add':
          day.status = 'overdue';
          break;
        case 'overdue':
          day.status = 'basic';
          break;
      }
    }
  }

  close(payload?: IHabit) {
    this.dialogRef.close(payload);
  }

  save() {
    this.habitService
      .addRecord(this.data._id, this.selectedDay?.status)
      .pipe(take(1))
      .subscribe((habit) => {
        this.message.success(
          this.translateService.instant('habit.message.successAddRecord')
        );
        this.close(habit);
      });
  }
}
