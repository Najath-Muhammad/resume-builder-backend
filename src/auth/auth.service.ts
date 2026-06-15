/**
 * @file src/auth/auth.service.ts
 * @description Business logic for authentication.
 * Handles registration, login, token refresh, logout, and profile retrieval.
 */

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY } from '../user/user.tokens';
import type { IUserRepository } from '../user/interfaces/user-repository.interface';
import type { SafeUser } from '../user/interfaces/user.interface';
import type { IAuthService } from './interfaces/auth-service.interface';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';

/** Cookie max-age in milliseconds */
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException('An account with this email already exists');
    }

    await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password, // hashed by the pre-save hook in the schema
    });

    return { message: 'Account created successfully. Please log in.' };
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  async login(dto: LoginDto, res: Response): Promise<SafeUser> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.#setAuthCookies(res, user._id, user.email, user.role);

    // Return user without password
    const { password: _, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------
  async refresh(
    refreshToken: string,
    res: Response,
  ): Promise<{ message: string }> {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Issue a new access token only
    const accessToken = this.#generateAccessToken(user._id, user.email, user.role);
    this.#setAccessTokenCookie(res, accessToken);

    return { message: 'Access token refreshed successfully' };
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------
  async logout(res: Response): Promise<{ message: string }> {
    this.#clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  // ---------------------------------------------------------------------------
  // Get Me
  // ---------------------------------------------------------------------------
  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  #generateAccessToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = { sub: userId, email, role: role as 'user' | 'admin', type: 'access' };
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    };
    return this.jwtService.sign(payload, options);
  }

  #generateRefreshToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = { sub: userId, email, role: role as 'user' | 'admin', type: 'refresh' };
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    };
    return this.jwtService.sign(payload, options);
  }

  #isProduction(): boolean {
    return this.configService.get<string>('nodeEnv') === 'production';
  }

  #setAccessTokenCookie(res: Response, token: string): void {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: this.#isProduction(),
      sameSite: 'strict',
      maxAge: ONE_DAY_MS,
    });
  }

  #setAuthCookies(res: Response, userId: string, email: string, role: string): void {
    const accessToken = this.#generateAccessToken(userId, email, role);
    const refreshToken = this.#generateRefreshToken(userId, email, role);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.#isProduction(),
      sameSite: 'strict',
      maxAge: ONE_DAY_MS,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.#isProduction(),
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS,
    });
  }

  #clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
