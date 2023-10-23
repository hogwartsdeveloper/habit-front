import { Component, OnInit } from '@angular/core';
import { HabitService } from '../services/habit.service';
import { IHabits } from '../models/habits.interface';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit {
  habits: IHabits = { active: [], history: [] };
  constructor(
    private readonly habitService: HabitService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.habitService
      .get(this.authService.user$.value?.id!)
      .subscribe((habits) => (this.habits = habits));
  }
}
