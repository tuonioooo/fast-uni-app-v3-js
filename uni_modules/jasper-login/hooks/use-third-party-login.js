import { AUTH_LOGIN_TYPE } from '../constants/auth.js';

const QUICK_LOGIN_TYPES = [
  AUTH_LOGIN_TYPE.APPLE,
  AUTH_LOGIN_TYPE.WEIXIN,
  AUTH_LOGIN_TYPE.WEIXIN_MOBILE,
];

/**
 * 三方登录相关页面辅助逻辑。
 *
 * 主要目标：
 * 1. 集中维护哪些登录方式属于第三方快速登录
 * 2. 统一解析微信手机号授权回调
 */
export function useThirdPartyLogin() {
  function isQuickLoginType(type = '') {
    return QUICK_LOGIN_TYPES.includes(type);
  }

  function resolveQuickLoginOptions(type, event = {}) {
    const options = {};

    if (type !== AUTH_LOGIN_TYPE.WEIXIN_MOBILE) {
      return {
        canContinue: true,
        options,
      };
    }

    if (event.detail?.errMsg === 'getPhoneNumber:ok') {
      options.code = event.detail.code;
      return {
        canContinue: true,
        options,
      };
    }

    return {
      canContinue: false,
      options,
      event,
    };
  }

  return {
    isQuickLoginType,
    resolveQuickLoginOptions,
  };
}
