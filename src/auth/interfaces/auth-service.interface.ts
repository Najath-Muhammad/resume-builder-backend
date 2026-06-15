/**
 * @file src/auth/interfaces/auth-service.interface.ts
 * @description Contract for auth business logic.
 * AuthController depends on this, not on AuthService directly.
 */

import type { Response } from 'express';
import type { RegisterDto } from '../dto/register.dto';
import type { LoginDto } from '../dto/login.dto';
import type { SafeUser } from '../../user/interfaces/user.interface';

export interface IAuthService {
  register(dto: RegisterDto): Promise<{ message: string }>;
  login(dto: LoginDto, res: Response): Promise<SafeUser>;
  refresh(refreshToken: string, res: Response): Promise<{ message: string }>;
  logout(res: Response): Promise<{ message: string }>;
  getMe(userId: string): Promise<SafeUser>;
}
