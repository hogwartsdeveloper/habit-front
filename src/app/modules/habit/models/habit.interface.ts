export enum HabitCalendarStatus {
  Success,
  Danger,
  Clean,
}

export interface IHabitCalendar {
  numDay: number;
  date: string;
  active: boolean;
  status: HabitCalendarStatus;
}

export interface IHabit {
  _id: string;
  name: string;
  description: string;
  isHide: boolean;
  isOverdue: boolean;
  startDate: string;
  endDate: string;
  countCompleted: number;
  lastActiveDate: string | null;

  days: IHabitCalendar[];
  userId: string;
}
