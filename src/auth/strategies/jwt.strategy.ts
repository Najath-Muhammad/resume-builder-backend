/**
 * @file src/auth/strategies/jwt.strategy.ts
 * @description Passport JWT strategy that reads the access token from cookies.
 * On successful validation, attaches the payload to request.user.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

/** Custom extractor — reads JWT from the accessToken HTTP-only cookie */
const cookieExtractor = (req: Request): string | null => {
  if (req?.cookies?.accessToken) {
    return req.cookies.accessToken as string;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret') ?? '',
    });
  }

  /**
   * Called after the JWT is verified.
   * The returned value is attached to request.user.
   */
  validate(payload: JwtPayload): JwtPayload {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }
    return payload;
  }
}
