import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('registration')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: RegistrationDto,
  ) {
    return this.authService.register(dto, response);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: AuthDto,
  ) {
    return this.authService.login(dto, response);
  }

  @UseGuards(AuthGuard)
  @Get('updateToken')
  async updateToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.updateToken(request.cookies?.token, response)
  }
}
