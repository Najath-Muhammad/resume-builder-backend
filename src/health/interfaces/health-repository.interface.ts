/**
 * @file src/health/interfaces/health-repository.interface.ts
 * @description Contract that any HealthRepository implementation must fulfill.
 *
 * The Service depends on THIS interface, NOT on the concrete HealthRepository class.
 * This is the Dependency Inversion Principle — high-level modules (Service) must not
 * depend on low-level modules (Repository). Both should depend on abstractions (this interface).
 */

import type { DatabaseHealth } from './health.interface';

export interface IHealthRepository {
  /**
   * Returns the current MongoDB connection status and database name.
   */
  getDatabaseStatus(): DatabaseHealth;
}
