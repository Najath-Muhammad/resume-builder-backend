/**
 * @file src/health/health.module.ts
 * @description Wires the health module using Dependency Inversion.
 *
 * This is the ONLY place in the health module that knows about concrete classes.
 * Everything else depends only on interfaces via tokens.
 *
 * Mapping:
 *   HEALTH_REPOSITORY token → HealthRepository class  (injected into HealthService)
 *   HEALTH_SERVICE token    → HealthService class      (injected into HealthController)
 */

import { Module } from '@nestjs/common';
import { HEALTH_REPOSITORY, HEALTH_SERVICE } from './health.tokens';
import { HealthRepository } from './health.repository';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    // Map the abstract token to its concrete implementation
    {
      provide: HEALTH_REPOSITORY,
      useClass: HealthRepository,
    },
    {
      provide: HEALTH_SERVICE,
      useClass: HealthService,
    },
  ],
})
export class HealthModule {}
