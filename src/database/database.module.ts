/**
 * @file src/database/database.module.ts
 * @description Configures and exports the Mongoose connection for the app.
 * Uses @nestjs/config to read MONGODB_URI from environment variables.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
        // Mongoose 7+ handles connection options automatically
      }),
    }),
  ],
})
export class DatabaseModule {}
