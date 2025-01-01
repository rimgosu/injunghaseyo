/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthControllerVerifyEmailParams {
  /**
   * email
   * @example "newnyup@gmail.com"
   */
  email: string;
}

export interface AuthControllerVerifyCodeParams {
  /**
   * email
   * @example "newnyup@gmail.com"
   */
  email: string;
  /** auth code */
  code: string;
}

export interface AuthControllerSignUpParams {
  /**
   * email
   * @example "newnyup@gmail.com"
   */
  email: string;
  /**
   * password
   * @example "injung123!@#"
   */
  password: string;
  /**
   * confirm password
   * @example "injung123!@#"
   */
  confirmPassword: string;
  /**
   * nickname
   * @example "injung2"
   */
  nickname: string;
  /**
   * agree require
   * @example true
   */
  requireAgree: boolean;
  /**
   * agree event
   * @example false
   */
  eventAgree: boolean;
}

export interface AuthControllerSignInParams {
  /**
   * email
   * @example "newnyup@gmail.com"
   */
  email: string;
  /**
   * password
   * @example "injung123!@#"
   */
  password: string;
}

export interface AuthControllerFindPasswordParams {
  /**
   * email
   * @example "newnyup@gmail.com"
   */
  email: string;
}

export interface AuthControllerChangePasswordParams {
  /**
   * password
   * @example "injung123!@#"
   */
  password: string;
  /**
   * change password
   * @example "injung123!@#1"
   */
  changePassword: string;
  /**
   * change password
   * @example "injung123!@#1"
   */
  confirmChangePassword: string;
}

export interface AuthControllerVerifyNicknameParams {
  /**
   * nickname
   * @example "injung2"
   */
  nickname: string;
}

export interface AuthControllerActivateOauthParams {
  /**
   * nickname
   * @example "injung2"
   */
  nickname: string;
  /**
   * agree require
   * @example true
   */
  requireAgree: boolean;
  /**
   * agree event
   * @example false
   */
  eventAgree: boolean;
}

export interface AuthControllerCharacterSelectParams {
  /**
   * 유저가 고른 character id
   * @example 1
   */
  characterId: number;
}

export interface GroupControllerCreateGroupParams {
  /**
   * 모임 제목
   * @example "헬스장 인증 모임"
   */
  title: string;
  /**
   * 모임 가격 (원)
   * @example 30000
   */
  price: number;
  /**
   * 모임 상세
   * @example "헬스장 가고 인증하는 모임입니다."
   */
  description?: string;
  /**
   * 인증 방법
   * @example "헬스장 출입 전
   * 헬스장 출입 후
   * 인증사진 찍어서 인증"
   */
  proofMethod: string;
  /**
   * 시간 (일자), ?dates=2024-12-21&dates=2024-12-22 꼴로 날짜 배열로 받음
   * @example ["2024-12-21","2024-12-22"]
   */
  dates: string[];
  /**
   * 태그, ?tags=헬스&tags=건강 꼴로 날짜 배열로 받음
   * @example ["헬스","건강"]
   */
  tags: string[];
}

export interface GroupControllerGetTagsParams {
  /**
   * 태그 검색
   * @example "헰"
   */
  tagSearch: string;
  /**
   * 태그, ?tags=헬스&tags=건강 꼴로 날짜 배열로 받음
   * @example ["건강"]
   */
  selectedTags?: string[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API 문서
 * @version 1.0
 * @contact
 *
 * NestJS로 만든 API 문서입니다.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags App
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: 'GET',
      ...params,
    });

  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyEmail
     * @request POST:/auth/verify-email
     */
    authControllerVerifyEmail: (query: AuthControllerVerifyEmailParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-email`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyCode
     * @request POST:/auth/verify-code
     */
    authControllerVerifyCode: (query: AuthControllerVerifyCodeParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-code`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerSignUp
     * @request POST:/auth/sign-up
     */
    authControllerSignUp: (query: AuthControllerSignUpParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/sign-up`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerSignIn
     * @request POST:/auth/sign-in
     */
    authControllerSignIn: (query: AuthControllerSignInParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/sign-in`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerReissueAtk
     * @request POST:/auth/reissue-atk
     */
    authControllerReissueAtk: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/reissue-atk`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerFindPassword
     * @request POST:/auth/find-password
     */
    authControllerFindPassword: (query: AuthControllerFindPasswordParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/find-password`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerChangePassword
     * @request PATCH:/auth/change-password
     * @secure
     */
    authControllerChangePassword: (query: AuthControllerChangePasswordParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/change-password`,
        method: 'PATCH',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerWithdraw
     * @request DELETE:/auth/withdraw
     * @secure
     */
    authControllerWithdraw: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/withdraw`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGoogleAuth
     * @request GET:/auth/google
     */
    authControllerGoogleAuth: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/auth/google`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGoogleAuthRedirect
     * @request GET:/auth/google/callback
     * @deprecated
     */
    authControllerGoogleAuthRedirect: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/google/callback`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerKakaoLogin
     * @request GET:/auth/kakao
     */
    authControllerKakaoLogin: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/auth/kakao`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerKakaoCallback
     * @request GET:/auth/kakao/callback
     * @deprecated
     */
    authControllerKakaoCallback: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/kakao/callback`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerNaverLogin
     * @request GET:/auth/naver
     */
    authControllerNaverLogin: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/auth/naver`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerNaverCallback
     * @request GET:/auth/naver/callback
     * @deprecated
     */
    authControllerNaverCallback: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/naver/callback`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyNickname
     * @request GET:/auth/verify-nickname
     */
    authControllerVerifyNickname: (query: AuthControllerVerifyNicknameParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-nickname`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerActivateOauth
     * @request POST:/auth/activate-oauth
     * @secure
     */
    authControllerActivateOauth: (query: AuthControllerActivateOauthParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/activate-oauth`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetCharacters
     * @request GET:/auth/characters
     * @secure
     */
    authControllerGetCharacters: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/characters`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerCharacterSelect
     * @request POST:/auth/character-select
     * @secure
     */
    authControllerCharacterSelect: (query: AuthControllerCharacterSelectParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/character-select`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),
  };
  group = {
    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerCreateGroup
     * @request POST:/group
     * @secure
     */
    groupControllerCreateGroup: (query: GroupControllerCreateGroupParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/group`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerGetTags
     * @request GET:/group/tags
     * @secure
     */
    groupControllerGetTags: (query: GroupControllerGetTagsParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/group/tags`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),
  };
}
