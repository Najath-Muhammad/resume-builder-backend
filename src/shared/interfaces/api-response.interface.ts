/**
 * @file src/shared/interfaces/api-response.interface.ts
 * @description Standard API response envelope used across all endpoints.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
