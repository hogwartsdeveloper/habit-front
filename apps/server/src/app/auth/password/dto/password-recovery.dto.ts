import { IsEmail, IsString } from 'class-validator';

export class PasswordRecoveryDto {
  @IsEmail()
  @IsString()
  email: string;
}
