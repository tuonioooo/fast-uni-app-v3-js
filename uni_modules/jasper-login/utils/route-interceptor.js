import { useUserStore } from '../stores/user';
import config from '../config.js';

const INTERCEPT_TYPES = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

function isWhitelisted(path, whiteList = []) {
  if (!path) return true;
  if (path.startsWith(config.paths.pagePrefix)) return true;
  return whiteList.includes(path);
}

export function setupRouteInterceptor(options = {}) {
  const { whiteList = [], onReject, pinia } = options;
  const mergedWhiteList = ['/pages/index/index', ...whiteList];

  INTERCEPT_TYPES.forEach((type) => {
    uni.removeInterceptor(type);
    uni.addInterceptor(type, {
      invoke(args) {
        const path = args?.url?.split('?')[0] || '';
        if (isWhitelisted(path, mergedWhiteList)) {
          return args;
        }

        const userStore = pinia ? useUserStore(pinia) : useUserStore();
        userStore.syncFromStorage();
        if (userStore.isLogin) {
          return args;
        }

        const redirect = encodeURIComponent(args.url || path);
        uni.navigateTo({
          url: `${config.paths.login}?redirect=${redirect}`,
        });

        if (typeof onReject === 'function') {
          onReject(args);
        }
        return false;
      },
      fail(error) {
        console.error('[jasper-login] route intercept fail:', error);
      },
    });
  });
}

export function removeRouteInterceptor() {
  INTERCEPT_TYPES.forEach((type) => uni.removeInterceptor(type));
}
