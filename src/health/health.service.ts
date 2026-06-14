/**
 * @file src/health/health.service.ts
 * @description Concrete implementation of IHealthService.
 *
 * RESPONSIBILITY: Business logic ONLY.
 * - Composes data from the repository
 * - Applies business rules (e.g. determining overall status)
 * - Does NOT know about HTTP or MongoDB internals
 *
 * DEPENDENCY INVERSION: This class depends on IHealthRepository (the interface/abstraction),
 * NOT on HealthRepository (the concrete class). NestJS injects the concrete class at runtime
 * via the HEALTH_REPOSITORY token, but this class never imports or references it directly.
 */

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HEALTH_REPOSITORY } from './health.tokens';
import type { IHealthRepository } from './interfaces/health-repository.interface';
import type { IHealthService } from './interfaces/health-service.interface';
import type { HealthStatus } from './interfaces/health.interface';

@Injectable()
export class HealthService implements IHealthService {
  constructor(
    // Injected by token → decoupled from the concrete HealthRepository class
    @Inject(HEALTH_REPOSITORY) private readonly healthRepository: IHealthRepository,
    private readonly configService: ConfigService,
  ) {}

  getHealth(): HealthStatus {
    const database = this.healthRepository.getDatabaseStatus();

    return {
      status: database.status === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('nodeEnv') ?? 'development',
      version: process.env.npm_package_version ?? '1.0.0',
      database,
    };
  }
}
