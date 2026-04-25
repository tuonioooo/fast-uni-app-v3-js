import dayjs from 'dayjs';
import {
  AUTH_DELAY,
  AUTH_LOGIN_TYPE,
  AUTH_MESSAGE,
  AUTH_MOCK_DATA,
  AUTH_RESULT_CODE,
  AUTH_STORAGE_KEY,
} from '../constants/auth.js';
import { randomDigitString } from '../utils/runtime-deps.js';

/**
 * 当前文件默认提供的是“快速演示用 mock 服务”。
 *
 * 设计目标：
 * 1. 让脚手架开箱即可演示登录链路
 * 2. 保持接口签名稳定，便于后续替换为真实生产实现
 *
 * 生产接入建议：
 * - 保留当前导出函数名不变
 * - 仅替换函数体中的 mock 逻辑为真实请求
 * - 让页面层继续调用 `common/login-api.js`
 *
 * 生产示例（伪代码）：
 * ```js
 * export async function loginByPhone(params = {}) {
 *   const res = await uni.request({
 *     url: '/api/auth/login-by-phone',
 *     method: 'POST',
 *     data: params,
 *   });
 *
 *   if (res.data.code !== 200) {
 *     return Promise.reject({
 *       code: res.data.code,
 *       msg: res.data.msg || '登录失败',
 *     });
 *   }
 *
 *   return {
 *     code: 200,
 *     data: {
 *       token: res.data.data.token,
 *       tokenExpired: res.data.data.tokenExpired,
 *       userInfo: res.data.data.userInfo,
 *       accountId: res.data.data.accountId,
 *     },
 *   };
 * }
 * ```
 */

function delay(ms = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function success(data) {
  return {
    code: AUTH_RESULT_CODE.SUCCESS,
    data,
  };
}

function failure(msg = AUTH_MESSAGE.LOGIN_FAIL) {
  return Promise.reject({
    code: AUTH_RESULT_CODE.FAIL,
    msg,
  });
}

function getSmsStorage() {
  return uni.getStorageSync(AUTH_STORAGE_KEY.SMS_INFO) || {};
}

function setSmsStorage(phoneNumber, smsCode) {
  uni.setStorageSync(AUTH_STORAGE_KEY.SMS_INFO, {
    phoneNumber,
    smsCode,
  });
}

function clearSmsStorage() {
  uni.removeStorageSync(AUTH_STORAGE_KEY.SMS_INFO);
}

function buildLoginResult() {
  const now = dayjs();
  return {
    token: AUTH_MOCK_DATA.TOKEN,
    tokenExpired: now.add(5, 'day'),
    userInfo: AUTH_MOCK_DATA.USER_INFO,
  };
}

export async function sendSms(params = {}) {
  const { phoneNumber } = params;
  await delay(AUTH_DELAY.SMS);

  const smsCode = randomDigitString(4);
  setSmsStorage(phoneNumber, smsCode);

  return success(smsCode);
}

export async function verifySms(params = {}) {
  const { phoneNumber, verificationCode } = params;
  await delay(AUTH_DELAY.SMS);

  const { smsCode, phoneNumber: savedPhoneNumber } = getSmsStorage();
  const checkResult = smsCode == verificationCode && savedPhoneNumber == phoneNumber;

  return success(checkResult);
}

export async function loginByPhone(params = {}) {
  await delay(AUTH_DELAY.LOGIN);

  let checkResult = false;
  if (params.loginType === AUTH_LOGIN_TYPE.SMS_CODE) {
    const { smsCode, phoneNumber } = getSmsStorage();
    checkResult =
      smsCode == params.verificationCode &&
      phoneNumber == params.phoneNumber &&
      params.loginType === AUTH_LOGIN_TYPE.SMS_CODE;

    if (checkResult) {
      clearSmsStorage();
    }
  } else if (
    params.loginType === AUTH_LOGIN_TYPE.UNIVERIFY ||
    params.loginType === AUTH_LOGIN_TYPE.WEIXIN_MOBILE
  ) {
    checkResult = true;
  }

  if (!checkResult) {
    return failure();
  }

  return success(buildLoginResult());
}

export async function loginByPassword(params = {}) {
  const { username, password } = params;
  await delay(AUTH_DELAY.LOGIN);

  if (!username || !password) {
    return failure(AUTH_MESSAGE.LOGIN_FAIL);
  }

  return success(buildLoginResult());
}

export async function getPhoneInfoByCode(params = {}) {
  const { appid, code } = params;
  await delay(AUTH_DELAY.WEIXIN_PHONE);

  if (!code) {
    return failure(AUTH_MESSAGE.MISSING_CODE);
  }

  return success({
    appid,
    phoneNumber: AUTH_MOCK_DATA.PHONE_NUMBER,
    purePhoneNumber: AUTH_MOCK_DATA.PHONE_NUMBER,
    countryCode: AUTH_MOCK_DATA.COUNTRY_CODE,
  });
}

export async function loginByWeixin() {
  await delay(AUTH_DELAY.WEIXIN_LOGIN);
  clearSmsStorage();
  return success(true);
}
