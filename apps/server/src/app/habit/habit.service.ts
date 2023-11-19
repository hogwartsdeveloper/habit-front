import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dayjs from 'dayjs';

import {
  Habit,
  HabitCalendar,
  HabitCalendarStatus,
  HabitDocument,
} from './habit.model';
import { CreateHabitDto } from './dto/create-habit.dto';
import { ERROR_HABIT_NOT_FOUND } from './habit.constants';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class HabitService {
  constructor(
    @InjectModel(Habit.name) private readonly habitModel: Model<Habit>,
    private readonly userService: UserService
  ) {}

  async create(dto: CreateHabitDto): Promise<HabitDocument> {
    await this.userService.findById(dto.userId);
    const habit = new this.habitModel({
      ...dto,
      countCompleted: 0,
      isOverdue: false,
    });

    habit.days = this.createHabitCalendar(habit);
    return habit.save();
  }

  async findByUserId(userId: string) {
    const res: { active: HabitDocument[]; history: HabitDocument[] } = {
      active: [],
      history: [],
    };
    const habits = await this.habitModel.find({ userId }).exec();
    habits.forEach((habit) => {
      if (
        (dayjs(habit.endDate).isSame(dayjs()) ||
          dayjs(habit.endDate).isAfter(dayjs())) &&
        !habit.isOverdue &&
        dayjs().diff(habit.lastActiveDate, 'days') <= 1
      ) {
        res.active.push(habit);
        return;
      }
      habit.updateOne({ isOverdue: true }, { new: true });
      res.history.push(habit);
    });
    return res;
  }

  async remove(id: string): Promise<HabitDocument | null> {
    const habit = this.habitModel.findByIdAndDelete(id).exec();

    if (!habit) {
      throw new BadRequestException(ERROR_HABIT_NOT_FOUND);
    }

    return habit;
  }

  async update(id: string, dto: UpdateHabitDto): Promise<HabitDocument | null> {
    const habit = this.habitModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!habit) {
      throw new BadRequestException(ERROR_HABIT_NOT_FOUND);
    }

    return habit;
  }

  async addRecord(id: string, dto: UpdateStatusDto) {
    const habit = await this.habitModel.findById(id);

    if (!habit) {
      throw new BadRequestException(ERROR_HABIT_NOT_FOUND);
    }

    const habitDay = habit.days.find((day) => day.date === dto.date);
    habitDay!.status = dto.status;
    habit.lastActiveDate = dayjs().format('YYYY-MM-DD');
    switch (habitDay!.status) {
      case HabitCalendarStatus.Success:
        habit.countCompleted++;
        break;
      case HabitCalendarStatus.Danger:
        habit.isOverdue = true;
    }

    return this.habitModel.findByIdAndUpdate(id, habit, { new: true });
  }

  private createHabitCalendar(habit: HabitDocument) {
    const result: HabitCalendar[] = [];

    const startDate = new Date(
      dayjs(habit.startDate).year(),
      dayjs(habit.startDate).month(),
      dayjs(habit.startDate).date()
    );

    for (let i = 0; i < 42; i++) {
      const day: HabitCalendar = {
        numDay: startDate.getDate(),
        status: HabitCalendarStatus.Clean,
        active: false,
        date: dayjs(startDate).format('YYYY-MM-DD'),
      };

      if (
        (dayjs(habit.startDate).isSame(dayjs(startDate)) ||
          dayjs(habit.startDate).isBefore(dayjs(startDate))) &&
        dayjs(habit.endDate).isAfter(dayjs(startDate))
      ) {
        day.active = true;
      }

      result.push(day);
      startDate.setDate(startDate.getDate() + 1);
    }

    return result;
  }
}
