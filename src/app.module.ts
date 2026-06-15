/**
 * @file src/app.module.ts
 * @description Root module. Imports ConfigModule (global), DatabaseModule, and feature modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
