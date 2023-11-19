import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { User } from '../../user/user.model';

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;

@Schema({ timestamps: true })
export class PasswordRecovery {
  @Prop({ type: MSchema.Types.String, ref: User.name })
  email: string;

  @Prop()
  token: string;

  @Prop()
  isRestored: boolean;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
