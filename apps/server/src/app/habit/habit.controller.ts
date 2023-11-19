import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { HabitService } from './habit.service';
import { AuthGuard } from '../guard/auth.guard';
import { CreateHabitDto } from './dto/create-habit.dto';
import { IdValidationPipe } from '../pipe/id-validation.pipe';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() dto: CreateHabitDto) {
    return this.habitService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getByUser(@Param('userId', IdValidationPipe) userId: string) {
    return this.habitService.findByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.habitService.remove(id);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateHabitDto,
  ) {
    return this.habitService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async addRecord(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.habitService.addRecord(id, dto);
  }
}
