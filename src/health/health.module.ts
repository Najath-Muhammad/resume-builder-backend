/**
 * @file src/health/health.module.ts
 * @description Registers HealthController and HealthService with NestJS DI.
 */

import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
