/**
 * @file src/health/interfaces/health-service.interface.ts
 * @description Contract that any HealthService implementation must fulfill.
 *
 * The Controller depends on THIS interface, NOT on the concrete HealthService class.
 * This keeps the Controller decoupled from business logic details — it only knows
 * what operations are available, not how they are performed.
 */

import type { HealthStatus } from './health.interface';

export interface IHealthService {
  /**
   * Gathers and returns a full health report of the application.
   */
  getHealth(): HealthStatus;
}
