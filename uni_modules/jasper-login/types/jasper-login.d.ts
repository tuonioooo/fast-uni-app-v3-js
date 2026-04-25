export interface JasperLoginResult {
  token?: string;
  tokenExpired?: string | number | Date | Record<string, any>;
  accountId?: string;
  userInfo?: Record<string, any>;
}

export interface JasperApiResult<T = any> {
  code: number;
  msg?: string;
  data: T;
}

export interface JasperSmsService {
  sendSms(params: { phoneNumber: string }): Promise<JasperApiResult<string>>;
  verifySms(params: { phoneNumber: string; verificationCode: string }): Promise<JasperApiResult<boolean>>;
}

export interface JasperAuthService {
  loginByPhone(params: Record<string, any>): Promise<JasperApiResult<JasperLoginResult>>;
  loginByPassword(params: { username: string; password: string }): Promise<JasperApiResult<JasperLoginResult>>;
}

export interface JasperWeixinService {
  getPhoneInfoByCode(params: { appid: string; code: string }): Promise<JasperApiResult<Record<string, any>>>;
  loginByWeixin(params: Record<string, any>): Promise<JasperApiResult<boolean>>;
}

export interface JasperLoginHooks {
  persistToken?: (payload: JasperLoginResult, context?: Record<string, any>) => void;
  persistUserInfo?: (payload: JasperLoginResult, phoneNumber?: string, context?: Record<string, any>) => void;
  onLoginSuccess?: (payload: JasperLoginResult, context?: Record<string, any>) => void;
}

export interface JasperLoginInstallOptions {
  pinia?: any;
  routeInterceptor?: boolean;
  whiteList?: string[];
  onReject?: (context: any) => void;
  services?: {
    sms?: Partial<JasperSmsService>;
    auth?: Partial<JasperAuthService>;
    weixin?: Partial<JasperWeixinService>;
  };
  hooks?: JasperLoginHooks;
}
