/**
 * 旧版示例接口已迁移到 examples 目录。
 *
 * 这个文件只作为“如何快速接一个演示接口”的参考，不参与模块主流程。
 * 正式运行时请优先替换 `services/auth-service.js` 中的 mock 实现，
 * 或直接让 `common/login-api.js` 指向你自己的服务层。
 */

import dayjs from "dayjs";

export function sendSmsApi({ phoneNumber }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const smsCode = "1234";
        uni.setStorageSync("smsInfo", {
          smsCode,
          phoneNumber,
        });
        resolve({
          code: 200,
          data: smsCode,
        });
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

export function smsCheckApi({ phoneNumber, verificationCode }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const smsInfo = uni.getStorageSync("smsInfo");
        const { smsCode, phoneNumber: cachedPhone } = smsInfo;
        resolve({
          code: 200,
          data: smsCode == verificationCode && cachedPhone == phoneNumber,
        });
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

export function sampleLoginApi(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const now = dayjs();
        resolve({
          code: 200,
          data: {
            token: "123456789",
            tokenExpired: now.add(5, "day"),
            userInfo: {
              nickname: "模拟用户",
              avatar: "https://www.uvui.cn/common/logo.png",
            },
            accountId: params?.phoneNumber || params?.username || "",
          },
        });
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}
