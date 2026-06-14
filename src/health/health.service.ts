/**
 * @file src/health/health.service.ts
 * @description Business logic for the health check endpoint.
 * Reads MongoDB connection state from Mongoose and returns a typed report.
 */

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { HealthStatus } from './interfaces/health.interface';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gathers server and database diagnostics.
   * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting.
   */
  getHealth(): HealthStatus {
    const isConnected = this.connection.readyState === 1;

    return {
      status: isConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('nodeEnv') ?? 'development',
      version: process.env.npm_package_version ?? '1.0.0',
      database: {
        status: isConnected ? 'connected' : 'disconnected',
        name: this.connection.name ?? 'unknown',
      },
    };
  }
}
