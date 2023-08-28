import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IHabit } from '../models/habit.interface';

@Injectable()
export class HabitService {
  habits$ = new BehaviorSubject<IHabit[]>([]);
}
