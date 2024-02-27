import { IHabit } from './habit.interface';

export interface IHabits {
  active: IHabit[];
  overdue: IHabit[];
}
