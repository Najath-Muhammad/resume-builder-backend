/**
 * @file src/health/health.repository.ts
 * @description Concrete implementation of IHealthRepository.
 *
 * RESPONSIBILITY: Database interaction ONLY.
 * - Knows about Mongoose Connection
 * - Returns raw data shapes, no business logic
 *
 * NOTE on private members:
 * - `private readonly` is used for injected dependencies (NestJS DI requires reflection access)
 * - `#field` (true ES2022 private) is used for internal state that has nothing to do with DI
 */

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { IHealthRepository } from './interfaces/health-repository.interface';
import type { DatabaseHealth } from './interfaces/health.interface';

@Injectable()
export class HealthRepository implements IHealthRepository {
  // `private readonly` used here because @InjectConnection() needs constructor reflection
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getDatabaseStatus(): DatabaseHealth {
    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const isConnected = this.connection.readyState === 1;

    return {
      status: isConnected ? 'connected' : 'disconnected',
      name: this.connection.name ?? 'unknown',
    };
  }
}
