/**
 * @file src/auth/auth.controller.ts
 * @description Handles all /auth/* HTTP requests.
 * Thin controller — delegates ALL logic to AuthService.
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AUTH_SERVICE } from './auth.tokens';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { IAuthService } from './interfaces/auth-service.interface';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}

  /** POST /api/auth/register */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** POST /api/auth/login */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  /** POST /api/auth/refresh */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token not found',
      });
    }
    return this.authService.refresh(refreshToken, res);
  }

  /** POST /api/auth/logout */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  /** GET /api/auth/me — protected */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.sub);
  }
}
