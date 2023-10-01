import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IHabit } from '../models/habit.interface';
import * as moment from 'moment/moment';

@Injectable()
export class HabitService {
  habits$ = new BehaviorSubject<IHabit[]>([]);

  countTotalDay(habit: IHabit) {
    return moment(habit.endDate).diff(habit.startDate, 'days');
  }
}
