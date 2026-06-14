/**
 * @file src/shared/interceptors/response.interceptor.ts
 * @description Global interceptor that wraps every successful response in
 * the standard { success, message, data } envelope automatically.
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: { message?: string; data?: T } | T) => {
        // If the controller already shapes the response, pass it through
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data
        ) {
          return data as unknown as ApiResponse<T>;
        }

        // Otherwise wrap it
        return {
          success: true,
          message: 'Request successful',
          data: data as T,
        };
      }),
    );
  }
}
