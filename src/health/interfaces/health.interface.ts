/**
 * @file src/health/interfaces/health.interface.ts
 * @description Pure data shapes for the health module. No logic, no dependencies.
 */

export interface DatabaseHealth {
  status: 'connected' | 'disconnected';
  name: string;
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  database: DatabaseHealth;
}
