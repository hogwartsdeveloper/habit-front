import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as dayjs from 'dayjs';

import {IHabit, IHabitCreate, IHabitRecord} from '../models/habit.interface';
import { IHabits } from '../models/habits.interface';
import {IApiResult} from "../../../shared/models/api-result";

@Injectable()
export class HabitService {
  constructor(private readonly http: HttpClient) {}

  countTotalDay(habit: IHabit) {
    return dayjs(habit.endDate).diff(habit.startDate, 'days');
  }

  add(habit: IHabitCreate) {
    return this.http.post<IApiResult<IHabit>>('/api/Habit', habit);
  }

  addRecord(id: string, record: IHabitRecord) {
    return this.http.patch<IApiResult<null>>("/api/Habit/AddRecord/" + id, [record]);
  }

  update(id: string, habit: IHabitCreate) {
    return this.http.put<IApiResult<IHabit>>('/api/Habit/' + id, habit);
  }

  delete(id: string) {
    return this.http.delete<IApiResult<IHabit>>('/api/Habit/' + id);
  }

  getGroup() {
    return this.http.get<IApiResult<IHabits>>('/api/Habit/Group');
  }
}
