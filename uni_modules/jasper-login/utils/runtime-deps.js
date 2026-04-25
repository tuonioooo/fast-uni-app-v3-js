/**
 * 统一收口 jasper-login 对宿主运行时的依赖。
 *
 * 这个模块的目标不是替代 `uni.$jasper`，而是把“jasper-login 需要宿主提供哪些能力”
 * 明确写出来，避免页面和服务层到处直接读 `uni.$jasper / uni.$constants`，
 * 后续排查依赖、替换宿主实现、补文档都会更清晰。
 */

function getJasperRuntime() {
  return uni.$jasper || {};
}

export function getResultSuccessCode() {
  return uni.$constants?.RESULT_SUCCESS_CODE ?? 200;
}

export function showJasperToast(message) {
  const runtime = getJasperRuntime();
  if (typeof runtime.showToast === 'function') {
    runtime.showToast(message);
    return;
  }
  uni.showToast({
    title: message,
    icon: 'none',
  });
}

export function plainJasperToast(message) {
  const runtime = getJasperRuntime();
  if (typeof runtime.toast === 'function') {
    runtime.toast(message);
    return;
  }
  showJasperToast(message);
}

export function trimAll(value) {
  const runtime = getJasperRuntime();
  if (typeof runtime.trim === 'function') {
    return runtime.trim(value, 'all');
  }
  return String(value || '').replace(/\s+/g, '');
}

export function isMobile(value) {
  const runtime = getJasperRuntime();
  if (typeof runtime.isMobile === 'function') {
    return runtime.isMobile(value);
  }
  return /^1\d{10}$/.test(String(value || ''));
}

export async function hasNetwork() {
  const runtime = getJasperRuntime();
  if (typeof runtime.hasNetwork === 'function') {
    return runtime.hasNetwork();
  }
  return true;
}

export function randomDigitString(length = 4) {
  const runtime = getJasperRuntime();
  if (typeof runtime.randomDigitString === 'function') {
    return runtime.randomDigitString(length);
  }

  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export function getThemeColor(name, fallback = '') {
  const runtime = getJasperRuntime();
  return runtime.theme?.[name] ?? fallback;
}

export function isFunction(value) {
  const runtime = getJasperRuntime();
  if (typeof runtime.isFn === 'function') {
    return runtime.isFn(value);
  }
  return typeof value === 'function';
}
