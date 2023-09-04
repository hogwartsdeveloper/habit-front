import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HabitService } from '../services/habit.service';
import { Subject, takeUntil } from 'rxjs';
import { IHabit } from '../models/habit.interface';
import { MatDialog } from '@angular/material/dialog';
import { HabitModalComponent } from '../habit-modal/habit-modal.component';
import * as moment from 'moment';
import { HabitViewEnum } from './models/habit-view.enum';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit, OnDestroy {
  habits = signal<IHabit[]>([]);
  selectedHabit: IHabit;
  type: HabitViewEnum = HabitViewEnum.Active;
  habitViewEnum = HabitViewEnum;
  destroy$ = new Subject();
  constructor(private dialog: MatDialog, public habitService: HabitService) {}

  ngOnInit() {
    this.habitService.habits$
      .pipe(takeUntil(this.destroy$))
      .subscribe((habits) => {
        this.habits.set(habits);
      });
  }

  onChangeViewType(type: HabitViewEnum) {
    this.type = type;
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
