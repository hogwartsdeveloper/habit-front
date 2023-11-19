import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { getMongoConfig } from './config/mongo.config';
import { HabitModule } from './habit/habit.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UserModule,
    HabitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
