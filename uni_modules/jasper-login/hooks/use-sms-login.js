import { hasNetwork, isMobile, showJasperToast, trimAll } from '../utils/runtime-deps.js';
import config from '../config.js';

/**
 * 短信登录相关的表单辅助逻辑。
 *
 * 这层的职责是把页面里反复出现的“手机号格式化 / 校验 / 导航”
 * 抽出来，页面只负责 UI 展示和事件转发。
 */
export function useSmsLogin() {
  function formatPhoneInput(value = '') {
    const formatted = value.replace(/\D/g, '').replace(/^/, '$& ').replace(/....(?!$)/g, '$& ');
    return formatted.trim();
  }

  function normalizePhone(phone = '') {
    return trimAll(phone);
  }

  function validatePhone(phone = '', options = {}) {
    const { silent = false } = options;
    const normalizedPhone = normalizePhone(phone);
    if (!isMobile(normalizedPhone)) {
      if (!silent) {
        showJasperToast('请输入正确的手机号');
      }
      return {
        valid: false,
        phoneNumber: normalizedPhone,
      };
    }

    return {
      valid: true,
      phoneNumber: normalizedPhone,
    };
  }

  async function ensureSmsRequestReady(phone = '') {
    const available = await hasNetwork();
    if (!available) {
      uni.showToast({
        title: '网络异常，请检查网络连接后重试',
        icon: 'none',
      });
      return {
        ready: false,
        phoneNumber: '',
      };
    }

    const validation = validatePhone(phone);
    return {
      ready: validation.valid,
      phoneNumber: validation.phoneNumber,
    };
  }

  async function ensureNetworkReady() {
    const available = await hasNetwork();
    return {
      ready: !!available,
    };
  }

  function toSmsCodePage(phoneNumber = '') {
    uni.navigateTo({
      url: `${config.paths.smsCode}?phone=${phoneNumber}&autoSend=1`,
    });
  }

  return {
    formatPhoneInput,
    normalizePhone,
    validatePhone,
    ensureSmsRequestReady,
    ensureNetworkReady,
    toSmsCodePage,
  };
}
