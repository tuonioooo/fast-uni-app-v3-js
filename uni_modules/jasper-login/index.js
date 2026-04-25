import { useUserStore } from './stores/user';
import { setupRouteInterceptor, removeRouteInterceptor } from './utils/route-interceptor';
import JasperLogin from './components/jasper-login/jasper-login.vue';
import { setupJasperLoginRegistry, getJasperLoginRegistry } from './services/service-registry.js';
import config from './config.js';

const TOKEN_KEY = 'jasper-user-token';
const TOKEN_EXPIRED_KEY = 'jasper-user-token-expired';

/**
 * jasper-login 插件实例。
 *
 * @typedef {Object} JasperLoginInstance
 * @property {string} tokenKey token 缓存 key
 * @property {string} tokenExpiredKey token 过期时间缓存 key
 * @property {ReturnType<typeof useUserStore>|null} userStore 当前 Pinia 用户 store
 * @property {() => boolean} isLogin 判断当前是否已登录
 * @property {() => void} logout 退出登录并清理缓存
 * @property {(url?: string) => void} toLogin 跳转登录页
 */

/**
 * 创建登录插件运行时实例。
 *
 * @param {object} [pinia] Pinia 实例
 * @returns {JasperLoginInstance}
 */
function createJasperLogin(pinia) {
  return {
    tokenKey: TOKEN_KEY,
    tokenExpiredKey: TOKEN_EXPIRED_KEY,
    userStore: pinia ? useUserStore(pinia) : null,
    isLogin() {
      const token = uni.getStorageSync(TOKEN_KEY);
      const tokenExpired = uni.getStorageSync(TOKEN_EXPIRED_KEY);
      return !!token && (!!tokenExpired ? tokenExpired > Date.now() : true);
    },
    logout() {
      if (pinia) {
        useUserStore(pinia).logout();
        return;
      }
      uni.removeStorageSync(TOKEN_KEY);
      uni.removeStorageSync(TOKEN_EXPIRED_KEY);
      uni.removeStorageSync('jasper-user-info');
      uni.removeStorageSync('miliqk-accountId');
    },
    toLogin(url = config.paths.login) {
      uni.navigateTo({ url });
    },
  };
}

/**
 * 安装 jasper-login 插件。
 *
 * @param {object} app Vue 应用实例
 * @param {object} [options={}] 安装选项
 * @param {object} [options.pinia] Pinia 实例
 * @param {boolean} [options.routeInterceptor=true] 是否启用路由登录拦截
 * @param {string[]} [options.whiteList=[]] 路由白名单
 * @param {(context: any) => void} [options.onReject] 路由被拦截时的回调
 * @param {object} [options.services] 宿主注入的服务实现
 * @param {object} [options.hooks] 宿主注入的登录成功 hooks
 */
function install(app, options = {}) {
  const {
    pinia,
    routeInterceptor = true,
    whiteList = [],
    onReject,
    services = {},
    hooks = {},
  } = options;
  const jasperLogin = createJasperLogin(pinia);

  setupJasperLoginRegistry({
    pinia,
    services,
    hooks,
  });

  if (app?.config?.globalProperties) {
    app.config.globalProperties.$jasperLogin = jasperLogin;
  } else if (app?.prototype) {
    app.prototype.$jasperLogin = jasperLogin;
  }

  if (typeof app?.component === 'function') {
    app.component('jasper-login', JasperLogin);
    app.component('JasperLogin', JasperLogin);
  }

  uni.$jasperLogin = jasperLogin;

  if (routeInterceptor) {
    setupRouteInterceptor({ pinia, whiteList, onReject });
  }
}

export {
  useUserStore,
  setupRouteInterceptor,
  removeRouteInterceptor,
  createJasperLogin,
  JasperLogin,
  setupJasperLoginRegistry,
  getJasperLoginRegistry,
};

export default {
  install,
};
