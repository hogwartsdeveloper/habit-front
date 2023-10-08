import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { HabitViewEnum } from '../habit/models/habit-view.enum';
import { IHabit } from '../models/habit.interface';
import { HabitService } from '../services/habit.service';
import { ICalendar } from '../habit/models/calendar.interface';
import { HabitCreateModalComponent } from '../habit-create-modal/habit-create-modal.component';
import { HabitModalComponent } from '../habit-modal/habit-modal.component';
import { take } from 'rxjs';
import { IHabits } from '../models/habits.interface';

@Component({
  selector: 'app-habit-view',
  templateUrl: './habit-view.component.html',
  styleUrls: ['./habit-view.component.scss'],
})
export class HabitViewComponent {
  @Input() viewType: 'interactive' | 'show' = 'interactive';
  @Input({ required: true }) allHabits: IHabits;
  habits: IHabit[] = [];
  type: HabitViewEnum = HabitViewEnum.Active;

  calendar: ICalendar = {
    startDate: moment().startOf('years').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  };

  constructor(private dialog: MatDialog) {}

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
        this.allHabits.active.push(res);
      });
  }

  changeDate(date: Date[]) {
    this.calendar.startDate = moment(date[0]).format('YYYY-MM-DD');
    this.calendar.endDate = moment(date[1]).format('YYYY-MM-DD');
  }
}
