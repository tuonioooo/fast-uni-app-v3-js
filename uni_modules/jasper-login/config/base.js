import { AUTH_LOGIN_TYPE } from '../constants/auth.js';

const MODULE_ROOT = '/uni_modules/jasper-login';
const LOGIN_PAGE = `${MODULE_ROOT}/pages/login/login-withoutpwd`;
const PASSWORD_LOGIN_PAGE = `${MODULE_ROOT}/pages/login/login-withpwd`;
const SMS_CODE_PAGE = `${MODULE_ROOT}/pages/login/login-smscode`;
const AGREEMENT_PAGE = `${MODULE_ROOT}/pages/agreements/agreement`;
const PRIVACY_PAGE = `${MODULE_ROOT}/pages/agreements/privacy`;

/**
 * 基础配置。
 *
 * 只描述“模块默认具备什么能力”，不关心平台差异。
 * 平台相关差异会在 `platform-overrides.js` 中追加，最后统一交给
 * `normalizeLoginConfig` 做运行时归一化和边界修正。
 */
const baseConfig = {
  debug: false,
  isAdmin: false,
  loginTypes: [
    AUTH_LOGIN_TYPE.SMS_CODE,
  ],
  paths: {
    moduleRoot: MODULE_ROOT,
    pagePrefix: `${MODULE_ROOT}/pages/`,
    login: LOGIN_PAGE,
    passwordLogin: PASSWORD_LOGIN_PAGE,
    smsCode: SMS_CODE_PAGE,
    agreement: AGREEMENT_PAGE,
    privacy: PRIVACY_PAGE,
  },
  agreements: {
    serviceUrl: `${AGREEMENT_PAGE}?needNav=1`,
    privacyUrl: `${PRIVACY_PAGE}?needNav=1`,
    scope: ['register', 'login'],
  },
  appid: {
    weixin: {
      h5: 'xxxxxx',
      web: 'xxxxxx',
      miniapp: 'wxc119f8aa174f8dac',
    },
  },
  passwordStrength: 'medium',
  setPasswordAfterLogin: false,
};

export default baseConfig;
