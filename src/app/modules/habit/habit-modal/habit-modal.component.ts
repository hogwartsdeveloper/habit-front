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
    if (this.data) {
      this.days = this.getDays();
    }
  }

  getDays() {
    const date = new Date(
      dayjs(this.data.startDate).year(),
      dayjs(this.data.startDate).month(),
      dayjs(this.data.startDate).date()
    );
    const result: ICalendarDay[] = [];

    let count = 0;
    date.setDate(date.getDate() - date.getDay());

    while (count < 42) {
      const day: ICalendarDay = {
        name: date.getDate(),
        status: 'basic',
        fullDate: dayjs(date).format('YYYY-MM-DD'),
      };

      if (
        (dayjs(this.data.startDate).isSame(dayjs(date)) ||
          dayjs(this.data.startDate).isBefore(dayjs(date))) &&
        dayjs(this.data.endDate).isAfter(dayjs(date))
      ) {
        day.active = true;

        if (
          dayjs(date).isSame(dayjs(this.data.lastActiveDate)) ||
          dayjs(date).isBefore(dayjs(this.data.lastActiveDate))
        ) {
          day.status =
            this.data.isOverdue &&
            this.data.lastActiveDate === dayjs(date).format('YYYY-MM-DD')
              ? 'overdue'
              : 'add';
        }
      }

      result.push(day);
      date.setDate(date.getDate() + 1);
      count++;
    }

    return result;
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
