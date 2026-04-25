import { getResultSuccessCode } from './runtime-deps.js';
import { getJasperLoginRegistry } from '../services/service-registry.js';

/**
 * 统一判断接口返回是否成功。
 *
 * 组件内原先分别依赖事件和页面各自判断返回值，容易出现
 * “A 页判断成功、B 页判断失败条件不同”的问题。
 * 这里统一收口成一套规则，后续切换真实接口时也只改这一处。
 *
 * @param {any} result 接口返回结果
 * @returns {boolean}
 */
export function isLoginResultSuccess(result) {
  return result?.code === getResultSuccessCode();
}

/**
 * 将登录结果统一写入 store。
 *
 * @param {object} options 登录结果参数
 * @param {any} options.result 接口返回结果
 * @param {string} [options.phoneNumber=''] 当前登录手机号
 * @returns {{ success: boolean, payload: object, message: string }}
 */
export function persistLoginResult({ result, phoneNumber = '' } = {}) {
  if (!isLoginResultSuccess(result)) {
    return {
      success: false,
      payload: {},
      message: result?.msg || '登录失败',
    };
  }

  const payload = result?.data || {};
  const { hooks } = getJasperLoginRegistry();
  hooks.onLoginSuccess(payload, {
    phoneNumber,
    result,
  });

  return {
    success: true,
    payload,
    message: result?.msg || '登录成功',
  };
}

/**
 * 处理登录成功后的页面跳转。
 *
 * 规则：
 * 1. 如果当前登录页带了 redirect 参数，优先跳去目标页
 * 2. `redirectTo` 失败时尝试 `switchTab`
 * 3. 两者都失败时执行兜底回调，通常是返回上一页
 *
 * @param {object} options 跳转参数
 * @param {string} [options.redirect] URL 中的 redirect 参数
 * @param {() => void} options.fallback 无 redirect 或跳转失败时的兜底动作
 */
export function redirectAfterLogin({ redirect, fallback }) {
  if (!redirect) {
    fallback();
    return;
  }

  const target = decodeURIComponent(redirect);
  uni.redirectTo({
    url: target,
    fail: () => {
      uni.switchTab({
        url: target,
        fail: fallback,
      });
    },
  });
}

/**
 * 获取当前页面 URL 上的 redirect 参数。
 *
 * @returns {string}
 */
export function getCurrentRedirect() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  return currentPage?.$page?.options?.redirect || '';
}
