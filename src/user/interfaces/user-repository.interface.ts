/**
 * @file src/user/interfaces/user-repository.interface.ts
 * @description Contract for user database operations.
 * AuthService depends on this interface, not on the concrete UserRepository.
 */

import type { IUser, SafeUser } from './user.interface';

export interface IUserRepository {
  /**
   * Find a user by email. Includes password field for auth verification.
   */
  findByEmail(email: string): Promise<IUser | null>;

  /**
   * Find a user by ID. Excludes password field.
   */
  findById(id: string): Promise<SafeUser | null>;

  /**
   * Check if a user with this email already exists.
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Create a new user. Password should already be hashed before calling this.
   */
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<SafeUser>;
}
