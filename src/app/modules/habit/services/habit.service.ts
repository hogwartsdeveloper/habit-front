import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment/moment';

import { IHabit } from '../models/habit.interface';

@Injectable()
export class HabitService {
  habits$ = new BehaviorSubject<IHabit[]>([]);

  constructor(private readonly http: HttpClient) {}

  countTotalDay(habit: IHabit) {
    return moment(habit.endDate).diff(habit.startDate, 'days');
  }

  add(habit: Omit<IHabit, '_id'>) {
    return this.http.post('/api/habit/create', habit);
  }

  update(id: string, habit: Omit<IHabit, '_id'>) {
    return this.http.patch('/api/habit/' + id, habit);
  }
}
