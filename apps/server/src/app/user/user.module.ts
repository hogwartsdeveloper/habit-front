import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.model';
import { FileModule } from '../file/file.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipe/id-validation.pipe';

@Global()
@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FileModule,
  ],
  providers: [UserService, IdValidationPipe],
  exports: [UserService]
})
export class UserModule {}
