import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HabitService } from '../services/habit.service';
import { Subject, takeUntil } from 'rxjs';
import { IHabit } from '../models/habit.interface';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit, OnDestroy {
  habits = signal<IHabit[]>([]);
  selectedHabit: IHabit;
  destroy$ = new Subject();
  constructor(private habitService: HabitService) {}

  ngOnInit() {
    this.habitService.habits$
      .pipe(takeUntil(this.destroy$))
      .subscribe((habits) => {
        this.habits.set(habits);
      });
  }

  onSelectHabit(habit: IHabit) {
    this.selectedHabit = habit;
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

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
