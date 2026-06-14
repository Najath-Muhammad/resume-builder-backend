/**
 * @file src/health/interfaces/health.interface.ts
 * @description Type definitions for the health check response.
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
