import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { PasswordService } from './password.service';

@Controller('auth/password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @UsePipes(new ValidationPipe())
  @Post('recovery')
  async recovery(@Body() dto: PasswordRecoveryDto) {
    return this.passwordService.recovery(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('change/:token')
  async change(@Param('token') token: string, @Body() dto: PasswordChangeDto) {
    return this.passwordService.change(token, dto);
  }

  @Get('check/:token')
  async checkToken(@Param('token') token: string) {
    const data = await this.passwordService.checkToken(token);
    return { email: data.email };
  }
}
