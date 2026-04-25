import {
  getCurrentRedirect,
  persistLoginResult,
  redirectAfterLogin,
} from '../utils/login-success.js';
import { showJasperToast } from '../utils/runtime-deps.js';

/**
 * 登录成功后的统一流程编排。
 *
 * 这里不关心是短信登录、账号密码登录还是三方登录，
 * 只关心“拿到接口结果以后应该如何落库、提示、跳转”。
 *
 * @param {object} options 流程选项
 * @param {() => void} options.fallbackRedirect 无 redirect 时的兜底返回动作
 */
export function useLoginFlow({ fallbackRedirect }) {
  function handleLoginSuccess({ result, phoneNumber = '', callback, successMessage = '登录成功' } = {}) {
    const loginState = persistLoginResult({
      result,
      phoneNumber,
    });

    if (!loginState.success) {
      showJasperToast(loginState.message);
      if (typeof callback === 'function') {
        callback();
      }
      return loginState;
    }

    showJasperToast(successMessage);
    if (typeof callback === 'function') {
      callback();
    }

    redirectAfterLogin({
      redirect: getCurrentRedirect(),
      fallback: fallbackRedirect,
    });

    return loginState;
  }

  return {
    handleLoginSuccess,
  };
}
