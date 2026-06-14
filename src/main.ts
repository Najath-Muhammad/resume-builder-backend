/**
 * @file src/main.ts
 * @description Application bootstrap.
 * Configures CORS, global API prefix, response interceptor, and exception filter.
 */

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  // CORS — allow only the configured frontend origin
  // ---------------------------------------------------------------------------
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ---------------------------------------------------------------------------
  // Global prefix — all routes are served under /api
  // ---------------------------------------------------------------------------
  app.setGlobalPrefix('api');

  // ---------------------------------------------------------------------------
  // Global pipes — validate and transform request DTOs
  // ---------------------------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,       // auto-transform payloads to DTO class instances
    }),
  );

  // ---------------------------------------------------------------------------
  // Global interceptor — wrap all responses in { success, message, data }
  // ---------------------------------------------------------------------------
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ---------------------------------------------------------------------------
  // Global exception filter — format all errors consistently
  // ---------------------------------------------------------------------------
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}/api`);
  logger.log(`🌐 Accepting requests from: ${frontendUrl}`);
}

bootstrap();
