import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MSchema } from 'mongoose';
import { User } from '../user/user.model';

export enum HabitCalendarStatus {
  Success,
  Danger,
  Clean,
}

export class HabitCalendar {
  @Prop()
  numDay: number;

  @Prop()
  date: string;

  @Prop()
  active: boolean;

  @Prop({ enum: HabitCalendarStatus })
  status: HabitCalendarStatus;
}

export type HabitDocument = HydratedDocument<Habit>;
@Schema({ timestamps: true })
export class Habit {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  isHide: boolean;

  @Prop()
  isOverdue: boolean;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop()
  countCompleted: number;

  @Prop()
  lastActiveDate: string;

  @Prop({ type: () => [HabitCalendar], _id: false })
  days: HabitCalendar[];

  @Prop({ type: MSchema.Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;
}
export const HabitSchema = SchemaFactory.createForClass(Habit);
