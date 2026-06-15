/**
 * @file src/auth/guards/jwt-auth.guard.ts
 * @description Reusable guard that protects routes requiring authentication.
 * Apply with @UseGuards(JwtAuthGuard) on any controller or route handler.
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
