/**
 * @file src/shared/filters/http-exception.filter.ts
 * @description Global exception filter — catches all HTTP exceptions and
 * formats them into the standard { success, message, statusCode } shape.
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string) ?? message;
        errors = res.errors;
      }
    } else {
      this.logger.error('Unhandled exception', exception);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
