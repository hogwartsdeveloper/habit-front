import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment/moment';

import { IHabit } from '../models/habit.interface';
import { IHabits } from '../models/habits.interface';

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

  delete(id: string) {
    return this.http.delete('/api/habit' + id);
  }

  get(userId: string) {
    return this.http.get<IHabits>('/api/habit/getByUser/' + userId);
  }
}
