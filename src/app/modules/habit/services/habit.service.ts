import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as dayjs from 'dayjs';

import { IHabit } from '../models/habit.interface';
import { IHabits } from '../models/habits.interface';

@Injectable()
export class HabitService {
  constructor(private readonly http: HttpClient) {}

  countTotalDay(habit: IHabit) {
    return dayjs(habit.endDate).diff(habit.startDate, 'days');
  }

  add(habit: Omit<IHabit, '_id'>) {
    return this.http.post<IHabit>('/api/habit/create', habit);
  }

  update(id: string, habit: Omit<IHabit, '_id'>) {
    return this.http.patch<IHabit>('/api/habit/' + id, habit);
  }

  delete(id: string) {
    return this.http.delete<IHabit>('/api/habit/' + id);
  }

  get(userId: string) {
    return this.http.get<IHabits>('/api/habit/getByUser/' + userId);
  }
}
