import { Api, ApiConfig } from '@rimgosu/libs';

export class ApiSingleton {
  private static instance: Api<unknown> | null = null;
  private static config: ApiConfig | null = null;

  public static getInstance(config?: ApiConfig): Api<unknown> {
    if (!ApiSingleton.instance || config !== ApiSingleton.config) {
      ApiSingleton.config = config || {
        baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
      };
      ApiSingleton.instance = new Api(ApiSingleton.config);
    }
    return ApiSingleton.instance;
  }

  public static resetInstance(): void {
    ApiSingleton.instance = null;
    ApiSingleton.config = null;
  }
}
