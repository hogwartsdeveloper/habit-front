import { IsNumber, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  code: number;
}
