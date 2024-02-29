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
  id: string;
  title: string;
  description?: string;
  isOverdue: boolean;
  startDate: string;
  endDate: string;
  record: IHabitRecord[];
}

export interface IHabitRecord {
  date: string;
  isComplete?: boolean;
}

export interface IHabitCreate {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}
