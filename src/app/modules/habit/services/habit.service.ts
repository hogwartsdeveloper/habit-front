import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as dayjs from 'dayjs';

import {
  HabitCalendarStatus,
  IHabit,
  IHabitCalendar,
} from '../models/habit.interface';
import { IHabits } from '../models/habits.interface';

@Injectable()
export class HabitService {
  constructor(private readonly http: HttpClient) {}

  countTotalDay(habit: IHabit) {
    return dayjs(habit.endDate).diff(habit.startDate, 'days');
  }

  add(habit: Omit<IHabit, '_id'>) {
    return this.http.post<IHabit>('/api/habits', habit);
  }

  addRecord(id: string, body: { date: string; status: HabitCalendarStatus }) {
    return this.http.patch<IHabit>('/api/habits/' + id, body);
  }

  update(id: string, habit: Omit<IHabit, '_id'>) {
    return this.http.put<IHabit>('/api/habits/' + id, habit);
  }

  delete(id: string) {
    return this.http.delete<IHabit>('/api/habits/' + id);
  }

  get(userId: string) {
    return this.http.get<IHabits>('/api/habits/' + userId);
  }
}
