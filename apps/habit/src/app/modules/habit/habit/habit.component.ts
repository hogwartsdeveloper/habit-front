import {Component, OnInit, signal} from '@angular/core';
import {take, tap} from 'rxjs';

import {HabitService} from '../services/habit.service';
import {IHabits} from '../models/habits.interface';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit {
  habits: IHabits = { active: [], history: [] };
  loading = signal(true);

  constructor(
    private readonly habitService: HabitService,
  ) {}

  ngOnInit() {
    this.habitService
      .get()
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((habits) => (this.habits = habits));
  }
}
