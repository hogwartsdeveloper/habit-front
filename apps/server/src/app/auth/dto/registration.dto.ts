import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegistrationDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
