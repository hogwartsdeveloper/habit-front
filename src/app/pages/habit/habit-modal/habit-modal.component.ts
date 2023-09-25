import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ICalendarDay } from './model/calendar-day.interface';
import { IHabit } from '../models/habit.interface';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent {
  weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  days: ICalendarDay[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: IHabit
  ) {
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
      }
      result.push(day);
      date.setDate(date.getDate() + 1);
      count++;
    }

    return result;
  }

  onDone(day: ICalendarDay) {
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
