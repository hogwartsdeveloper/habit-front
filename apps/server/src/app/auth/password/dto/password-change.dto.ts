import { IsString } from 'class-validator';

export class PasswordChangeDto {
  @IsString()
  password: string;
}
