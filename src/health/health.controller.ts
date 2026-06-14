/**
 * @file src/health/health.controller.ts
 * @description Handles GET /api/health HTTP requests.
 *
 * RESPONSIBILITY: Input/Output ONLY.
 * - Receives HTTP request
 * - Calls the service
 * - Returns HTTP response
 * - No business logic lives here
 *
 * DEPENDENCY INVERSION: Depends on IHealthService (the interface), not HealthService (the class).
 */

import { Controller, Get, Inject } from '@nestjs/common';
import { HEALTH_SERVICE } from './health.tokens';
import type { IHealthService } from './interfaces/health-service.interface';
import type { ApiResponse } from '../shared/interfaces/api-response.interface';
import type { HealthStatus } from './interfaces/health.interface';

@Controller('health')
export class HealthController {
  constructor(
    // Injected by token → decoupled from the concrete HealthService class
    @Inject(HEALTH_SERVICE) private readonly healthService: IHealthService,
  ) {}

  @Get()
  check(): ApiResponse<HealthStatus> {
    const data = this.healthService.getHealth();

    return {
      success: true,
      message: 'Backend is running',
      data,
    };
  }
}
