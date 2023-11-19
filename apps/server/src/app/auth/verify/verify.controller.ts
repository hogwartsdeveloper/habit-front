import { Body, Controller, HttpCode, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';

import { VerifyService } from './verify.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthDto } from '../dto/auth.dto';

@Controller('auth/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('email')
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.verifyService.verifyEmail(dto, response);
  }

  @UsePipes(new ValidationPipe())
  @Post('tryAgain')
  async tryAgainVerify(@Body() dto: AuthDto) {
    return this.verifyService.tryAgainVerify(dto);
  }
}
