/**
 * @file src/health/health.tokens.ts
 * @description Dependency Injection tokens for the health module.
 *
 * Since TypeScript interfaces are erased at runtime, NestJS cannot use them
 * directly as DI tokens. We use unique Symbols instead.
 *
 * Usage:
 *   @Inject(HEALTH_REPOSITORY) private readonly repo: IHealthRepository
 */

export const HEALTH_REPOSITORY = Symbol('IHealthRepository');
export const HEALTH_SERVICE = Symbol('IHealthService');
