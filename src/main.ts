/**
 * @file src/main.ts
 * @description Application bootstrap.
 * Configures CORS, cookie-parser, global prefix, interceptors, and filters.
 */

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('port') ?? 3001;
  const frontendUrl = configService.get<string>('frontendUrl') ?? 'http://localhost:3000';

  // ---------------------------------------------------------------------------
  // Cookie parser — must be registered BEFORE CORS and routes
  // Allows req.cookies to be populated in controllers and strategies
  // ---------------------------------------------------------------------------
  app.use(cookieParser());

  // ---------------------------------------------------------------------------
  // CORS — allow only the configured frontend origin with credentials
  // credentials: true is required for HTTP-only cookies to be sent cross-origin
  // ---------------------------------------------------------------------------
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ---------------------------------------------------------------------------
  // Global prefix
  // ---------------------------------------------------------------------------
  app.setGlobalPrefix('api');

  // ---------------------------------------------------------------------------
  // Global validation pipe
  // ---------------------------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ---------------------------------------------------------------------------
  // Global interceptor + exception filter
  // ---------------------------------------------------------------------------
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}/api`);
  logger.log(`🌐 Accepting requests from: ${frontendUrl}`);
}

bootstrap();
