export interface ICalendarDay {
  name: number;
  fullDate: string;
  active?: boolean;
  status: 'basic' | 'success' | 'danger';
}
