export interface ApiErrorType {
  message: string;
  statusCode: number;
  error: string;
}

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ApiErrorType };
