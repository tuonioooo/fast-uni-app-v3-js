import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const TOKEN_KEY = 'jasper-user-token';
const USERINFO_KEY = 'jasper-user-info';
const TOKEN_EXPIRED_KEY = 'jasper-user-token-expired';
const ACCOUNT_ID_KEY = 'miliqk-accountId';

/**
 * 用户资料结构。
 *
 * @typedef {Object} JasperUserInfo
 * @property {string} accountId 业务账号 ID
 * @property {string} avatar 头像
 * @property {string} phone 手机号
 * @property {string} deviceNo 设备编号
 * @property {string} gender 性别
 * @property {string} signStatus 签到状态
 * @property {string} id 用户 ID
 * @property {string} nickname 昵称
 * @property {string} tenantId 租户 ID
 * @property {string} token 兼容旧字段的 token
 * @property {number} updateNicknameCount 昵称修改次数
 * @property {number} minutes 用户时长
 */

/**
 * 登录结果结构。
 *
 * @typedef {Object} JasperLoginResult
 * @property {string} [token] 登录 token
 * @property {string|number|Date|Object} [tokenExpired] token 过期时间
 * @property {string} [accountId] 业务账号 ID
 * @property {Partial<JasperUserInfo>} [userInfo] 用户信息
 */

/**
 * Store 对外暴露的登录状态结构。
 *
 * @typedef {Object} JasperUserStore
 * @property {JasperUserInfo} initUserInfo 初始用户信息
 * @property {import('vue').Ref<string>} token 当前 token
 * @property {import('vue').Ref<JasperUserInfo>} userInfo 当前用户信息
 * @property {import('vue').Ref<string|number|Date|Object>} tokenExpired token 过期时间
 * @property {import('vue').Ref<string>} accountId 当前业务账号 ID
 * @property {import('vue').ComputedRef<boolean>} isLogin 是否已登录
 * @property {() => void} syncFromStorage 从本地缓存重新同步登录状态
 * @property {(value: string, expiredAt?: string|number|Date|Object) => void} setToken 设置 token 与过期时间
 * @property {(info?: Partial<JasperUserInfo>) => void} setUserInfo 覆盖设置用户信息
 * @property {(value?: string) => void} setAccountId 设置业务账号 ID
 * @property {(payload?: JasperLoginResult, phoneNumber?: string) => void} setLoginResult 按登录结果统一落库
 * @property {(info?: Partial<JasperUserInfo>) => void} add 兼容旧版的新增用户信息方法
 * @property {(info?: Partial<JasperUserInfo>) => void} update 增量更新用户信息
 * @property {() => void} reset 重置用户信息
 * @property {(signStatus?: string) => void} updateSignStatus 更新签到状态
 * @property {() => void} logout 退出登录并清理缓存
 */

/** @type {JasperUserInfo} */
const initUserInfo = {
  accountId: '',
  avatar: '',
  phone: '',
  deviceNo: '',
  gender: '',
  signStatus: '',
  id: '',
  nickname: '游客',
  tenantId: '',
  token: '',
  updateNicknameCount: 1,
  minutes: 0,
};

function safeParse(value, fallback = {}) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function normalizeExpired(value) {
  if (!value) return '';
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? value : timestamp;
  }
  if (typeof value === 'object' && typeof value.valueOf === 'function') {
    return value.valueOf();
  }
  return value;
}

/**
 * 登录用户状态管理。
 *
 * 负责统一维护 token、用户信息、业务账号 ID 及其本地缓存同步。
 *
 * @returns {JasperUserStore}
 */
export const useUserStore = defineStore('jasper-user', () => {
  const token = ref(uni.getStorageSync(TOKEN_KEY) || '');
  const userInfo = ref({
    ...initUserInfo,
    ...safeParse(uni.getStorageSync(USERINFO_KEY), {}),
  });
  const tokenExpired = ref(uni.getStorageSync(TOKEN_EXPIRED_KEY) || '');
  const accountId = ref(uni.getStorageSync(ACCOUNT_ID_KEY) || '');

  const isLogin = computed(() => !!token.value);

  /**
   * 从本地缓存同步登录状态到 store。
   */
  function syncFromStorage() {
    token.value = uni.getStorageSync(TOKEN_KEY) || '';
    userInfo.value = {
      ...initUserInfo,
      ...safeParse(uni.getStorageSync(USERINFO_KEY), {}),
    };
    tokenExpired.value = uni.getStorageSync(TOKEN_EXPIRED_KEY) || '';
    accountId.value = uni.getStorageSync(ACCOUNT_ID_KEY) || '';
  }

  /**
   * 设置 token，并同步 token 过期时间到缓存。
   *
   * @param {string} value token
   * @param {string|number|Date|Object} [expiredAt=''] token 过期时间
   */
  function setToken(value, expiredAt = '') {
    const nextToken = value || '';
    const nextExpired = normalizeExpired(expiredAt);

    token.value = nextToken;
    tokenExpired.value = nextExpired;

    if (nextToken) {
      uni.setStorageSync(TOKEN_KEY, nextToken);
    } else {
      uni.removeStorageSync(TOKEN_KEY);
    }

    if (nextExpired) {
      uni.setStorageSync(TOKEN_EXPIRED_KEY, nextExpired);
    } else {
      uni.removeStorageSync(TOKEN_EXPIRED_KEY);
    }
  }

  /**
   * 覆盖设置用户信息，并写入本地缓存。
   *
   * @param {Partial<JasperUserInfo>} [info={}] 用户信息
   */
  function setUserInfo(info = {}) {
    userInfo.value = {
      ...initUserInfo,
      ...(info || {}),
    };
    if (info && Object.keys(info).length) {
      uni.setStorageSync(USERINFO_KEY, JSON.stringify(userInfo.value));
    } else {
      uni.removeStorageSync(USERINFO_KEY);
    }
  }

  /**
   * 设置业务账号 ID。
   *
   * @param {string} [value=''] 业务账号 ID
   */
  function setAccountId(value = '') {
    accountId.value = value || '';
    if (accountId.value) {
      uni.setStorageSync(ACCOUNT_ID_KEY, accountId.value);
    } else {
      uni.removeStorageSync(ACCOUNT_ID_KEY);
    }
  }

  /**
   * 按统一登录结果写入 token、用户信息、账号 ID。
   *
   * 这是 Phase3 迁移后的统一登录落库入口，旧版本的缓存写入逻辑
   * 已集中收敛到这里，避免页面和接口层重复维护存储细节。
   *
   * @param {JasperLoginResult} [payload={}] 登录结果
   * @param {string} [phoneNumber=''] 当前登录手机号
   */
  function setLoginResult(payload = {}, phoneNumber = '') {
    const profile = {
      ...userInfo.value,
      ...(payload.userInfo || {}),
    };

    if (phoneNumber) {
      profile.phone = phoneNumber;
    }
    // 同步缓存
    setToken(payload.token, payload.tokenExpired);
    setUserInfo(profile);
    setAccountId(payload.accountId || '');
  }

  /**
   * 退出登录并清理缓存。
   */
  function logout() {
    setToken('');
    setUserInfo(initUserInfo);
    setAccountId('');
  }

  /**
   * 兼容旧版调用，等价于覆盖设置用户信息。
   *
   * @param {Partial<JasperUserInfo>} [info={}] 用户信息
   */
  function add(info = {}) {
    setUserInfo(info);
  }

  /**
   * 增量更新用户信息。
   *
   * @param {Partial<JasperUserInfo>} [info={}] 用户信息
   */
  function update(info = {}) {
    setUserInfo({
      ...userInfo.value,
      ...(info || {}),
    });
  }

  /**
   * 重置用户信息为初始状态。
   */
  function reset() {
    setUserInfo(initUserInfo);
  }

  /**
   * 更新签到状态。
   *
   * @param {string} [signStatus=''] 签到状态
   */
  function updateSignStatus(signStatus = '') {
    update({ signStatus });
  }

  return {
    initUserInfo,
    token,
    userInfo,
    tokenExpired,
    accountId,
    isLogin,
    syncFromStorage,
    setToken,
    setUserInfo,
    setAccountId,
    setLoginResult,
    add,
    update,
    reset,
    updateSignStatus,
    logout,
  };
});
