/**
 * @file src/auth/auth.module.ts
 * @description Wires the auth module — imports UserModule for the repository,
 * configures JwtModule, and registers strategy + guard.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AUTH_SERVICE } from './auth.tokens';

@Module({
  imports: [
    // Import UserModule to get access to USER_REPOSITORY token
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule registered without a default secret — secrets are passed
    // per-sign call in AuthService to support two different secrets
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, PassportModule],
})
export class AuthModule {}
