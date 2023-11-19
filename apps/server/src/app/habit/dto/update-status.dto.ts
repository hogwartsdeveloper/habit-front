import { IsEnum, IsString } from 'class-validator';

import { HabitCalendarStatus } from '../habit.model';

export class UpdateStatusDto {
  @IsString()
  date: string;

  @IsEnum(HabitCalendarStatus)
  status: HabitCalendarStatus;
}
