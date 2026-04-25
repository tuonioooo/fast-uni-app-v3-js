import { AUTH_LOGIN_TYPE } from '../constants/auth.js';

const PASSWORD_STRENGTH_VALUES = ['super', 'strong', 'medium', 'weak', false];
const VALID_LOGIN_TYPES = new Set(Object.values(AUTH_LOGIN_TYPE));
const DEFAULT_MODULE_ROOT = '/uni_modules/jasper-login';

function normalizeLoginTypes(config = {}) {
  return [...new Set((config.loginTypes || []).filter((type) => VALID_LOGIN_TYPES.has(type)))];
}

function normalizePaths(config = {}) {
  const paths = config.paths || {};
  const moduleRoot = paths.moduleRoot || DEFAULT_MODULE_ROOT;
  const pagePrefix = paths.pagePrefix || `${moduleRoot}/pages/`;
  const login = paths.login || `${moduleRoot}/pages/login/login-withoutpwd`;
  const passwordLogin = paths.passwordLogin || `${moduleRoot}/pages/login/login-withpwd`;
  const smsCode = paths.smsCode || `${moduleRoot}/pages/login/login-smscode`;
  const agreement = paths.agreement || `${moduleRoot}/pages/agreements/agreement`;
  const privacy = paths.privacy || `${moduleRoot}/pages/agreements/privacy`;

  return {
    moduleRoot,
    pagePrefix,
    login,
    passwordLogin,
    smsCode,
    agreement,
    privacy,
  };
}

function normalizeAgreements(config = {}) {
  const agreements = config.agreements || {};
  const paths = normalizePaths(config);
  return {
    serviceUrl: agreements.serviceUrl || `${paths.agreement}?needNav=1`,
    privacyUrl: agreements.privacyUrl || `${paths.privacy}?needNav=1`,
    scope: Array.isArray(agreements.scope) && agreements.scope.length ? agreements.scope : ['register', 'login'],
  };
}

function normalizePasswordStrength(config = {}) {
  return PASSWORD_STRENGTH_VALUES.includes(config.passwordStrength) ? config.passwordStrength : 'medium';
}

function normalizeSetPasswordAfterLogin(config = {}) {
  const value = config.setPasswordAfterLogin;
  if (value === false || value === true) {
    return value;
  }

  if (value && typeof value === 'object') {
    return {
      allowSkip: !!value.allowSkip,
    };
  }

  return false;
}

/**
 * 对登录配置做运行时归一化。
 *
 * 这一层负责：
 * 1. 去重
 * 2. 过滤非法登录类型
 * 3. 补齐默认字段
 * 4. 保证页面层拿到的是稳定结构
 *
 * @param {object} config 原始配置
 * @returns {object}
 */
export function normalizeLoginConfig(config = {}) {
  return {
    ...config,
    paths: normalizePaths(config),
    loginTypes: normalizeLoginTypes(config),
    agreements: normalizeAgreements(config),
    passwordStrength: normalizePasswordStrength(config),
    setPasswordAfterLogin: normalizeSetPasswordAfterLogin(config),
  };
}
