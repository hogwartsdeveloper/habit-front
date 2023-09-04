import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HabitService } from '../services/habit.service';
import { Subject, takeUntil } from 'rxjs';
import { IHabit } from '../models/habit.interface';
import { MatDialog } from '@angular/material/dialog';
import { HabitModalComponent } from '../habit-modal/habit-modal.component';
import * as moment from 'moment';
import { HabitViewEnum } from './models/habit-view.enum';
import { ICalendar } from './models/calendar.interface';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit, OnDestroy {
  allHabits: IHabit[] = [];
  habits = signal<IHabit[]>([]);
  selectedHabit: IHabit;
  type: HabitViewEnum = HabitViewEnum.Active;
  habitViewEnum = HabitViewEnum;
  calendar: ICalendar = {
    startDate: null,
    endDate: moment().format('YYYY-MM-DD'),
  };
  destroy$ = new Subject();
  constructor(private dialog: MatDialog, public habitService: HabitService) {}

  ngOnInit() {
    this.habitService.habits$
      .pipe(takeUntil(this.destroy$))
      .subscribe((habits) => {
        this.allHabits = habits;
        this.filterHabit(habits);
      });
  }

  filterHabit(habits: IHabit[]) {
    switch (this.type) {
      case HabitViewEnum.Active:
        this.habits.set(
          habits.filter((habit) =>
            moment(habit.endDate).isSameOrAfter(moment())
          )
        );
        break;
      case HabitViewEnum.History:
        this.habits.set(
          habits.filter((habit) => {
            if (!this.calendar.startDate) {
              return moment(habit.endDate).isSameOrBefore(
                moment(this.calendar.endDate)
              );
            }
            return (
              moment(habit.endDate).isSameOrAfter(
                moment(this.calendar.startDate)
              ) &&
              moment(habit.endDate).isSameOrBefore(
                moment(this.calendar.endDate)
              )
            );
          })
        );
    }
  }

  onChangeViewType(type: HabitViewEnum) {
    this.type = type;
    this.filterHabit(this.allHabits);
  }

  onChangeDate(
    event: MatDatepickerInputEvent<any>,
    type: 'startDate' | 'endDate'
  ) {
    this.calendar[type] = moment(event.value).format('YYYY-MM-DD');
    this.filterHabit(this.allHabits);
  }

  onSelectHabit(habit: IHabit) {
    this.selectedHabit = habit;
  }

  onEdit() {
    this.dialog.open(HabitModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
      autoFocus: false,
      data: this.selectedHabit,
    });
  }

  addHabit() {
    this.dialog.open(HabitModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
      autoFocus: false,
    });
  }

  onDelete() {
    this.habitService.habits$.next(
      this.habitService.habits$.value.filter(
        (habit) => habit.id !== this.selectedHabit.id
      )
    );

    localStorage.setItem(
      'habits',
      JSON.stringify(this.habitService.habits$.value)
    );
  }

  onDone(habit: IHabit) {
    if (habit.lastActiveDate !== moment().format('YYYY-MM-DD')) {
      habit.count = Math.min(
        ++habit.count,
        this.habitService.countTotalDay(habit)
      );
      habit.lastActiveDate = moment().format('YYYY-MM-DD');

      this.habitService.habits$.next(this.habits());

      localStorage.setItem(
        'habits',
        JSON.stringify(this.habitService.habits$.value)
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
