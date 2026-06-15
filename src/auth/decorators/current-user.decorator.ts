/**
 * @file src/auth/decorators/current-user.decorator.ts
 * @description Custom parameter decorator that extracts the authenticated user
 * from the request object (populated by JwtStrategy.validate).
 *
 * Usage:
 *   @Get('me')
 *   @UseGuards(JwtAuthGuard)
 *   getMe(@CurrentUser() user: JwtPayload) { ... }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    return request.user;
  },
);
