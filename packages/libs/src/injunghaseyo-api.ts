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

export interface SignInRes {
  /**
   * email
   * @example "newnyup@gmail.com"
   */
  email: string;
  /** access token */
  accessToken: string;
}

export interface GetCheckSignIn {
  /** sign in status */
  userStatus: GetCheckSignInUserStatusEnum;
}

export interface ReissueAtkRes {
  /** access token */
  accessToken: string;
}

export interface CharacterInfo {
  /**
   * 캐릭터 레벨
   * @example 1
   */
  level: number;
  /**
   * 캐릭터 이미지 URL
   * @example "https://example.com/image.jpg"
   */
  photoUrl: string;
}

export interface GetCharacter {
  /**
   * 캐릭터 ID
   * @example 1
   */
  id: number;
  /**
   * 캐릭터 이름
   * @example "캐릭터 이름"
   */
  name: string;
  /** 캐릭터 정보 */
  characterInfos: CharacterInfo[];
}

export interface GetTagsRes {
  /**
   * 태그, ?tags=헬스&tags=건강 꼴로 날짜 배열로 받음
   * @example ["헬스","건강"]
   */
  tags: string[];
}

export interface GroupElem {
  /** 그룹 ID */
  id: number;
  /** 그룹 제목 */
  title: string;
  /** 그룹 가격 */
  price: number;
  /** 그룹 설명 */
  description: string;
  /** 그룹 증명 방법 */
  proofMethods: string[];
  /** 그룹 상태 */
  status: GroupElemStatusEnum;
  /** 그룹 시작일 */
  startDate: string;
  /** 그룹 종료일 */
  endDate: string;
  /** 참여자 수 */
  numberOfParticipants: number;
  /** 참여 상태 */
  joinStatus: GroupElemJoinStatusEnum;
  /** 태그 */
  tags: string[];
}

export interface GetGroupsRes {
  /** 그룹 목록 */
  groups: GroupElem[];
}

export interface Participant {
  /** 참여자 ID */
  id: number;
  /** 참여자 사진 */
  profilePhoto: string;
}

export interface GetGroupRes {
  /** 그룹 ID */
  id: number;
  /** 그룹 제목 */
  title: string;
  /** 그룹 가격 */
  price: number;
  /** 그룹 설명 */
  description: string;
  /** 그룹 증명 방법 */
  proofMethods: string[];
  /** 그룹 상태 */
  status: GetGroupResStatusEnum;
  /** 그룹 시작일 */
  startDate: string;
  /** 그룹 종료일 */
  endDate: string;
  /** 참여 상태 */
  joinStatus: GetGroupResJoinStatusEnum;
  /** 태그 */
  tags: string[];
  /** 참여자 목록 */
  participants: Participant[];
}

export interface Proof {
  /** 인증 사진 */
  proofPhoto: string | null;
  /** 인증 방법 */
  proofMethod: string;
  /** 모임 진행 id */
  groupProgressId: number;
}

export interface GetTodayRes {
  /** 그룹 제목 */
  title: string;
  /** 그룹 설명 */
  description: string;
  /** 전체 인증 일정 */
  groupDate: string[];
  /** 완료한 인증 */
  completedDate: string[];
  /** 인증 정보 */
  proofs: Proof[];
}

export interface GetTodayRewardRes {
  /**
   * 오늘까지의 받을 금액
   * @example 1000
   */
  todayReward: number;
}

export interface GetMoneyDto {
  /**
   * 보유한 인증 머니
   * @example 10000
   */
  money: number;
}

/** sign in status */
export enum GetCheckSignInUserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  WITHDRAWN = 'WITHDRAWN',
  OAUTH_PENDING = 'OAUTH_PENDING',
  CHARACTER_CHOOSE = 'CHARACTER_CHOOSE',
}

/** 그룹 상태 */
export enum GroupElemStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

/** 참여 상태 */
export enum GroupElemJoinStatusEnum {
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_JOINED = 'NOT_JOINED',
  NOT_JOINABLE = 'NOT_JOINABLE',
}

/** 그룹 상태 */
export enum GetGroupResStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

/** 참여 상태 */
export enum GetGroupResJoinStatusEnum {
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_JOINED = 'NOT_JOINED',
  NOT_JOINABLE = 'NOT_JOINABLE',
}

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

export interface AuthControllerVerifyPasswordParams {
  /**
   * password
   * @example "injung123!@#"
   */
  password: string;
}

export interface AuthControllerVerifyNicknameParams {
  /**
   * nickname
   * @example "injung2"
   */
  nickname: string;
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
   * @example ["헬스장 출입 전","헬스장 출입 후","인증사진 찍어서 인증"]
   */
  proofMethods: string[];
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

export interface GroupControllerGetTodayParams {
  /**
   * (개발 전용), 오늘 날짜를 원하는 날짜로 지정한다.
   * @example "2025-01-18"
   */
  today: string;
  /**
   * 모임 ID
   * @example 1
   */
  groupId: number;
}

export interface GroupControllerUploadProofPhotoParams {
  /**
   * (개발 전용), 오늘 날짜를 원하는 날짜로 지정한다.
   * @example "2025-01-18"
   */
  today: string;
  /**
   * 진행 id
   * @example 1
   */
  progressId: number;
  /**
   * 모임 ID
   * @example 1
   */
  groupId: number;
}

export interface UserMgmtControllerGetAdminRoleParams {
  /**
   * 비밀번호
   * @example "tlaznd@0801"
   */
  auth: string;
}

export interface UserMgmtControllerGainMoneyParams {
  /**
   * 얻을 인증머니
   * @example 35000
   */
  money: number;
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
     * @name AuthControllerVerifyPassword
     * @request GET:/auth/verify-password
     */
    authControllerVerifyPassword: (query: AuthControllerVerifyPasswordParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-password`,
        method: 'GET',
        query: query,
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
      this.request<SignInRes, any>({
        path: `/auth/sign-in`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerCheckSignIn
     * @request GET:/auth/check-sign-in
     * @secure
     */
    authControllerCheckSignIn: (params: RequestParams = {}) =>
      this.request<GetCheckSignIn, any>({
        path: `/auth/check-sign-in`,
        method: 'GET',
        secure: true,
        format: 'json',
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
      this.request<ReissueAtkRes, any>({
        path: `/auth/reissue-atk`,
        method: 'POST',
        format: 'json',
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
      this.request<GetCharacter, any>({
        path: `/auth/characters`,
        method: 'GET',
        secure: true,
        format: 'json',
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
  groups = {
    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerCreateGroup
     * @request POST:/groups
     * @secure
     */
    groupControllerCreateGroup: (query: GroupControllerCreateGroupParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/groups`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerGetGroups
     * @request GET:/groups
     */
    groupControllerGetGroups: (params: RequestParams = {}) =>
      this.request<any, GetGroupsRes>({
        path: `/groups`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerGetTags
     * @request GET:/groups/tags
     * @secure
     */
    groupControllerGetTags: (query: GroupControllerGetTagsParams, params: RequestParams = {}) =>
      this.request<any, GetTagsRes>({
        path: `/groups/tags`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerJoinGroup
     * @request POST:/groups/{groupId}/join
     * @secure
     */
    groupControllerJoinGroup: (groupId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/groups/${groupId}/join`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerGetGroup
     * @request GET:/groups/{groupId}
     */
    groupControllerGetGroup: (groupId: number, params: RequestParams = {}) =>
      this.request<any, GetGroupRes>({
        path: `/groups/${groupId}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerLeaveGroup
     * @request DELETE:/groups/{groupId}/leave
     * @secure
     */
    groupControllerLeaveGroup: (groupId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/groups/${groupId}/leave`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerGetToday
     * @request GET:/groups/{groupId}/today
     * @secure
     */
    groupControllerGetToday: ({ groupId, ...query }: GroupControllerGetTodayParams, params: RequestParams = {}) =>
      this.request<any, GetTodayRes>({
        path: `/groups/${groupId}/today`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerUploadProofPhoto
     * @request POST:/groups/{groupId}/upload
     * @secure
     */
    groupControllerUploadProofPhoto: (
      { groupId, ...query }: GroupControllerUploadProofPhotoParams,
      data: {
        /** @format binary */
        proofPhoto?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/groups/${groupId}/upload`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupControllerGetTodayReward
     * @request GET:/groups/{groupId}/today-reward
     * @secure
     */
    groupControllerGetTodayReward: (groupId: number, params: RequestParams = {}) =>
      this.request<any, GetTodayRewardRes>({
        path: `/groups/${groupId}/today-reward`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags User
     * @name UserControllerGetMoney
     * @request GET:/users/money
     * @secure
     */
    userControllerGetMoney: (params: RequestParams = {}) =>
      this.request<any, GetMoneyDto>({
        path: `/users/money`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  usersMgmt = {
    /**
     * No description
     *
     * @tags UserMgmt
     * @name UserMgmtControllerGetAdminRole
     * @request POST:/users-mgmt/admin
     * @secure
     */
    userMgmtControllerGetAdminRole: (query: UserMgmtControllerGetAdminRoleParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users-mgmt/admin`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserMgmt
     * @name UserMgmtControllerGainMoney
     * @request POST:/users-mgmt/gain-money
     * @secure
     */
    userMgmtControllerGainMoney: (query: UserMgmtControllerGainMoneyParams, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users-mgmt/gain-money`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),
  };
}
