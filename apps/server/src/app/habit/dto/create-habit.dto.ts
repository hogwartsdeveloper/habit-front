import { IsBoolean, IsString } from 'class-validator';

export class CreateHabitDto {
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

  @IsString()
  userId: string;
}
