import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { User } from '../../user/user.model';

export type VerifyDocument = HydratedDocument<Verify>;

@Schema({ timestamps: true })
export class Verify {
  @Prop({ type: MSchema.Types.String, ref: User.name })
  email: string;

  @Prop()
  isVerify: boolean;

  @Prop()
  code: number;

  @Prop()
  countAttempt: number;
}

export const VerifySchema = SchemaFactory.createForClass(Verify);
