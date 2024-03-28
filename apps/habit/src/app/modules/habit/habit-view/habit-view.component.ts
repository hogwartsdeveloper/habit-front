import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as dayjs from 'dayjs';

import {HabitViewEnum} from '../habit/models/habit-view.enum';
import {ICalendar} from '../habit/models/calendar.interface';
import {HabitCreateModalComponent} from '../habit-create-modal/habit-create-modal.component';
import {HabitService} from "../services/habit.service";
import {IHabit} from "../models/habit.interface";

@Component({
  selector: 'app-habit-view',
  templateUrl: './habit-view.component.html',
  styleUrls: ['./habit-view.component.scss']
})
export class HabitViewComponent {
  @Input() viewType: 'interactive' | 'show' = 'interactive';
  @Input({ required: true }) activeHabits: IHabit[];
  @Input({ required: true }) overdueHabits: IHabit[];
  type: HabitViewEnum = HabitViewEnum.Active;

  calendar: ICalendar = {
    startDate: dayjs().startOf('years').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };

  constructor(
    private dialog: MatDialog,
    private readonly habitService: HabitService,
  ) {}

  addHabit() {
    this.dialog
      .open(HabitCreateModalComponent, {
        width: '400px',
        height: '500px',
        panelClass: 'noBackground',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((res) => {
        if (!res) {
          return;
        }
        this.habitService.change$.next(null);
      });
  }

  changeDate(date: Date[]) {
    this.calendar.startDate = dayjs(date[0]).format('YYYY-MM-DD');
    this.calendar.endDate = dayjs(date[1]).format('YYYY-MM-DD');
  }
}
