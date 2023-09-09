import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HabitViewEnum } from '../habit/models/habit-view.enum';
import { IHabit } from '../models/habit.interface';
import { HabitService } from '../services/habit.service';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../utils/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HabitModalComponent } from '../habit-modal/habit-modal.component';
import { ICalendar } from '../habit/models/calendar.interface';
import * as moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-habit-content',
  templateUrl: './habit-content.component.html',
  styleUrls: ['./habit-content.component.scss'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ButtonComponent,
    CommonModule,
    TranslateModule,
  ],
})
export class HabitContentComponent implements OnChanges {
  @Input() viewType: 'interactive' | 'show' = 'interactive';
  @Input({ required: true }) habits: IHabit[];
  allHabits: IHabit[];
  HabitViewEnum = HabitViewEnum;
  type: HabitViewEnum = HabitViewEnum.Active;

  calendar: ICalendar = {
    startDate: null,
    endDate: moment().format('YYYY-MM-DD'),
  };

  constructor(private dialog: MatDialog, private habitService: HabitService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['habits']) {
      this.allHabits = [...this.habits];
      this.filterHabit(this.habits);
    }
  }

  onChangeViewType(type: HabitViewEnum) {
    this.type = type;
    this.filterHabit(this.allHabits);
  }

  countTotalDay(habit: IHabit) {
    return this.habitService.countTotalDay(habit);
  }

  onEdit(habit: IHabit) {
    this.dialog.open(HabitModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
      autoFocus: false,
      data: habit,
    });
  }

  onDelete(habit: IHabit) {
    this.habitService.habits$.next(
      this.habitService.habits$.value.filter((item) => item.id !== habit.id)
    );

    localStorage.setItem(
      'habits',
      JSON.stringify(this.habitService.habits$.value)
    );
  }

  onChangeDate(
    event: MatDatepickerInputEvent<Date>,
    type: 'startDate' | 'endDate'
  ) {
    this.calendar[type] = moment(event.value).format('YYYY-MM-DD');
    this.filterHabit(this.allHabits);
  }

  addHabit() {
    this.dialog.open(HabitModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
      autoFocus: false,
    });
  }

  filterHabit(habits: IHabit[]) {
    switch (this.type) {
      case HabitViewEnum.Active:
        this.habits = habits.filter((habit) => {
          return (
            moment(habit.endDate).isSameOrAfter(moment()) &&
            moment().diff(moment(habit.lastActiveDate), 'days') <= 1
          );
        });
        break;
      case HabitViewEnum.History:
        this.habits = habits.filter((habit) => {
          if (!this.calendar.startDate) {
            return moment(habit.endDate).isSameOrBefore(
              moment(this.calendar.endDate)
            );
          }
          return (
            moment(habit.endDate).isSameOrAfter(
              moment(this.calendar.startDate)
            ) &&
            moment(habit.endDate).isSameOrBefore(moment(this.calendar.endDate))
          );
        });
    }
  }

  onDone(habit: IHabit) {
    if (this.viewType === 'show') return;

    if (habit.lastActiveDate !== moment().format('YYYY-MM-DD')) {
      habit.count = Math.min(
        ++habit.count,
        this.habitService.countTotalDay(habit)
      );
      habit.lastActiveDate = moment().format('YYYY-MM-DD');

      this.habitService.habits$.next(this.habits);

      localStorage.setItem(
        'habits',
        JSON.stringify(this.habitService.habits$.value)
      );
    }
  }
}
