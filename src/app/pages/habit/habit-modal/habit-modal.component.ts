import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ICalendarDay } from './model/calendar-day.interface';
import { IHabit } from '../models/habit.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent implements OnInit {
  weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  days: ICalendarDay[] = [];
  today = moment().format('YYYY-MM-DD');
  selectedDay: ICalendarDay | null;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private message: NzMessageService,
    private translateService: TranslateService,
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
      moment(this.data.startDate).year(),
      moment(this.data.startDate).month(),
      moment(this.data.startDate).date()
    );
    const result: ICalendarDay[] = [];

    let count = 0;
    date.setDate(date.getDate() - date.getDay());

    while (count < 42) {
      const day: ICalendarDay = {
        name: date.getDate(),
        status: 'basic',
        fullDate: moment(date).format('YYYY-MM-DD'),
      };

      if (
        moment(this.data.startDate).isSameOrBefore(moment(date)) &&
        moment(this.data.endDate).isAfter(moment(date))
      ) {
        day.active = true;

        if (moment(date).isSameOrBefore(moment(this.data.lastActiveDate))) {
          day.status =
            this.data.isOverdue &&
            this.data.lastActiveDate === moment(date).format('YYYY-MM-DD')
              ? 'danger'
              : 'success';
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
          day.status = 'success';
          break;
        case 'success':
          day.status = 'danger';
          break;
        case 'danger':
          day.status = 'basic';
          break;
      }
    }
  }

  close(payload?: IHabit) {
    this.dialogRef.close(payload);
  }

  save() {
    switch (this.selectedDay?.status) {
      case 'success':
        this.data.count++;
        break;
      case 'danger':
        this.data.isOverdue = true;
        break;
    }

    this.data.lastActiveDate = this.today;
    this.message.success(
      this.translateService.instant('habit.message.successAddRecord')
    );
    this.close(this.data);
  }
}
