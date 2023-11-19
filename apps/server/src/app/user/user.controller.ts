import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthGuard } from '../guard/auth.guard';
import { IdValidationPipe } from '../pipe/id-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('checkEmailExist/:email')
  async checkEmailExist(@Param('email') email: string) {
    return this.userService.verifyEmailExist(email);
  }

  @Get('checkEmailNotExist/:email')
  async checkEmailNotExist(@Param('email') email: string) {
    return this.userService.verifyEmailNotExist(email);
  }

  @Post('uploadImg/:userId')
  @UseGuards(AuthGuard)
  async uploadImg(
    @Body('image') image: string,
    @Param('userId', IdValidationPipe) userId: string,
  ) {
    return this.userService.updateImage(userId, image);
  }

  @Put(':userId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('userId', IdValidationPipe) userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(userId, dto);
  }

  @Delete('uploadImg/:userId')
  @UseGuards(AuthGuard)
  async deleteImg(@Param('userId', IdValidationPipe) userId: string) {
    return this.userService.removeImage(userId);
  }
}
