import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent {
  weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  days: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { startDate: string; endDate: string }
  ) {
    if (this.data) {
      this.days = this.getDays();
    }
  }

  getDays(): string[] {
    const date = new Date(
      moment(this.data.startDate).year(),
      moment(this.data.startDate).month(),
      moment(this.data.startDate).date()
    );
    const result: string[] = [];

    let count = 0;
    while (count < 42) {
      result.push(date.getDate() + '-' + this.weekDays[date.getDay()]);
      date.setDate(date.getDate() + 1);
      count++;
    }

    return result;
  }
}
