/**
 * @file src/user/interfaces/user.interface.ts
 * @description User data shapes used across the application.
 */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string; // optional — excluded in most responses
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

/** Safe user object — password is never included */
export type SafeUser = Omit<IUser, 'password'>;
