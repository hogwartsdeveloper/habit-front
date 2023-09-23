import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { startDate: string; endDate: string }
  ) {
    if (this.data) {
      console.log(this.getDays());
    }
  }

  getDays(): string[] {
    const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const date = new Date(
      moment(this.data.startDate).year(),
      moment(this.data.startDate).month(),
      moment(this.data.startDate).date()
    );
    const result: string[] = [];

    while (moment(this.data.endDate).isSameOrAfter(date)) {
      result.push(date.getDate() + '-' + weekDays[date.getDay()]);
      date.setDate(date.getDate() + 1);
    }

    return result;
  }
}
