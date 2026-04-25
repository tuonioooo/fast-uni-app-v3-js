import {
  getPhoneInfoByCode,
  loginByPassword,
  loginByPhone,
  loginByWeixin,
  sendSms,
  verifySms,
} from './auth-service.js';
import { useUserStore } from '../stores/user.js';

const registry = {
  services: {
    sms: {
      sendSms,
      verifySms,
    },
    auth: {
      loginByPhone,
      loginByPassword,
    },
    weixin: {
      getPhoneInfoByCode,
      loginByWeixin,
    },
  },
  hooks: {
    persistToken: null,
    persistUserInfo: null,
    onLoginSuccess: null,
  },
  context: {
    pinia: null,
  },
};

function getUserStore() {
  return registry.context.pinia ? useUserStore(registry.context.pinia) : useUserStore();
}

function defaultPersistToken(payload = {}) {
  const userStore = getUserStore();
  userStore.setToken(payload.token, payload.tokenExpired);
}

function defaultPersistUserInfo(payload = {}, phoneNumber = '') {
  const userStore = getUserStore();
  const profile = {
    ...userStore.userInfo.value,
    ...(payload.userInfo || {}),
  };

  if (phoneNumber) {
    profile.phone = phoneNumber;
  }

  userStore.setUserInfo(profile);
  userStore.setAccountId(payload.accountId || '');
}

function defaultOnLoginSuccess(payload = {}, context = {}) {
  registry.hooks.persistToken(payload, context);
  registry.hooks.persistUserInfo(payload, context.phoneNumber || '', context);
}

registry.hooks.persistToken = defaultPersistToken;
registry.hooks.persistUserInfo = defaultPersistUserInfo;
registry.hooks.onLoginSuccess = defaultOnLoginSuccess;

/**
 * 安装或覆盖 jasper-login 的服务与 hooks。
 *
 * 设计原则：
 * 1. 默认服务始终可用，便于脚手架快速演示
 * 2. 宿主只需要覆盖自己关心的部分，而不是整套全部重写
 * 3. 页面层始终通过统一注册中心读取服务，不感知具体实现来源
 *
 * @param {object} [options={}] 安装配置
 * @param {object} [options.services] 宿主注入的服务实现
 * @param {object} [options.hooks] 宿主注入的登录成功 hooks
 * @param {object} [options.pinia] Pinia 实例
 */
export function setupJasperLoginRegistry(options = {}) {
  const { services = {}, hooks = {}, pinia = null } = options;

  registry.context.pinia = pinia || null;
  registry.services.sms = {
    ...registry.services.sms,
    ...(services.sms || {}),
  };
  registry.services.auth = {
    ...registry.services.auth,
    ...(services.auth || {}),
  };
  registry.services.weixin = {
    ...registry.services.weixin,
    ...(services.weixin || {}),
  };
  registry.hooks = {
    ...registry.hooks,
    ...(hooks || {}),
  };
}

export function getJasperLoginRegistry() {
  return registry;
}
