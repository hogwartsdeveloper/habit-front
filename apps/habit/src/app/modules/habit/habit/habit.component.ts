import { Component, OnInit } from '@angular/core';

import { HabitService } from '../services/habit.service';
import { IHabits } from '../models/habits.interface';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit {
  habits: IHabits = { active: [], history: [] };
  constructor(
    private readonly habitService: HabitService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.habitService
      .get(this.userService.user$.value?.id!)
      .subscribe((habits) => (this.habits = habits));
  }
}
