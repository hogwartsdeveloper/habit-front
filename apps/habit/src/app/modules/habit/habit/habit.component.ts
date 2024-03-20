import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Subject, take, takeUntil, tap} from 'rxjs';

import {HabitService} from '../services/habit.service';
import {IHabits} from '../models/habits.interface';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit, OnDestroy {
  habits: IHabits;
  loading = signal(true);
  destroy$ = new Subject();

  constructor(
    private readonly habitService: HabitService,
  ) {}

  ngOnInit() {
    this.getHabit();

    this.habitService.change$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getHabit())
  }

  getHabit() {
    this.habitService
      .getGroup()
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((res) => {
        if (!res.result) return;

        this.habits = res.result;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
