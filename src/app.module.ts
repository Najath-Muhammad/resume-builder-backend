/**
 * @file src/app.module.ts
 * @description Root module. Imports ConfigModule (global), DatabaseModule, and feature modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // ConfigModule is global — no need to import it in every feature module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),

    // Database connection
    DatabaseModule,

    // Feature modules
    HealthModule,
  ],
})
export class AppModule {}
