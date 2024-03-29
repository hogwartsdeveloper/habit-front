export interface IHabit {
  id: string;
  title: string;
  description?: string;
  isOverdue: boolean;
  startDate: string;
  endDate: string;
  records: IHabitRecord[];
  countComplete: number;
}

export interface IHabitRecord {
  date: string;
  isComplete: boolean | null;
}

export interface IHabitCreate {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}
