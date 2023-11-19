import { IsBoolean, IsString } from 'class-validator';

export class UpdateHabitDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isHide: boolean;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
