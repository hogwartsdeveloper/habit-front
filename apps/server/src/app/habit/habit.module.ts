import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';
import { Habit, HabitSchema } from './habit.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Habit.name, schema: HabitSchema}]),
    AuthModule
  ],
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}
