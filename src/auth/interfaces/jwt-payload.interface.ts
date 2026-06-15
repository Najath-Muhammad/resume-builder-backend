/**
 * @file src/auth/interfaces/jwt-payload.interface.ts
 * @description Shape of the JWT token payload.
 */

export interface JwtPayload {
  /** User's MongoDB ID */
  sub: string;
  email: string;
  role: 'user' | 'admin';
  /** Distinguishes access tokens from refresh tokens */
  type: 'access' | 'refresh';
}
