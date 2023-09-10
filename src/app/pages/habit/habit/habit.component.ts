import { Component, OnDestroy, OnInit } from '@angular/core';
import { HabitService } from '../services/habit.service';
import { Subject, takeUntil } from 'rxjs';
import { IHabit } from '../models/habit.interface';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit, OnDestroy {
  habits: IHabit[] = [];
  destroy$ = new Subject();
  constructor(public habitService: HabitService) {}

  ngOnInit() {
    this.habitService.habits$
      .pipe(takeUntil(this.destroy$))
      .subscribe((habits) => {
        this.habits = habits.map((habit, id) => {
          const lastActive = habit.lastActiveDate
            ? moment(habit.lastActiveDate)
            : moment();

          habit.isOverdue = moment().diff(lastActive, 'days') > 1;
          return habit;
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
