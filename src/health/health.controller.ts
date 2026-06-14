/**
 * @file src/health/health.controller.ts
 * @description Handles GET /health requests.
 * Delegates all logic to HealthService — controller only handles HTTP concerns.
 */

import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { ApiResponse } from '../shared/interfaces/api-response.interface';
import type { HealthStatus } from './interfaces/health.interface';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

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
