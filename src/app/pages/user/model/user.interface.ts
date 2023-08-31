import { IHabit } from '../../habit/models/habit.interface';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  img: string;
  habits: IHabit[];
}
