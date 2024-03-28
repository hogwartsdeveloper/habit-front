import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Subject, take, takeUntil, tap} from 'rxjs';

import {HabitService} from '../services/habit.service';
import {IHabit} from "../models/habit.interface";

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HabitComponent implements OnInit, OnDestroy {
  activeHabits: IHabit[];
  overdueHabits: IHabit[];
  loading = signal(true);
  destroy$ = new Subject();

  constructor(
    private readonly habitService: HabitService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getHabit();

    this.habitService.change$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getHabit();
      })
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
        this.activeHabits = res.result.active;
        this.overdueHabits = res.result.overdue;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
