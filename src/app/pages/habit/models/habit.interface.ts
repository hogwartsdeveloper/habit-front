export interface IHabit {
  id: number;
  name: string;
  description: string;
  isHide: boolean;
  isOverdue: boolean;
  startDate: string;
  endDate: string;
  count: number;
  lastActiveDate: string | null;
}
