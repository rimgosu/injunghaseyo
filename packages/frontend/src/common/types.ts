export interface ApiErrorType {
  message: string;
  statusCode: number;
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorType;
}
