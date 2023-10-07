import { Component, OnInit } from '@angular/core';
import { HabitService } from '../services/habit.service';
import { IHabits } from '../models/habits.interface';

@Component({
  selector: 'app-change',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit {
  habits: IHabits;
  constructor(public habitService: HabitService) {}

  ngOnInit() {
    this.habitService
      .get('651f80fc007ede299e36a86c')
      .subscribe((habits) => (this.habits = habits));
  }
}
