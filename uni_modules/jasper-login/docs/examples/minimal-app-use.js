/**
 * 最小可运行接入示例。
 *
 * 作用：
 * - 展示宿主项目如何安装 jasper-login
 * - 展示如何注入 services / hooks
 *   - services 自定义外部的业务方法
 *   - hooks 走默认持久化逻辑
 * - 作为 readme 中的最小启动样例
 */

// #ifdef VUE3
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import uvUI from '@climblee/uv-ui';
import Request from '@/util/request/index';
import ConstantsPlugin from '@/common/plugins/constants';
import jasper from '@/uni_modules/jasper-ui';
import JasperLogin from '@/uni_modules/jasper-login';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();

  app.use(uvUI);
  app.use(jasper);
  app.use(pinia);
  app.use(Request);
  app.use(ConstantsPlugin);

  app.use(JasperLogin, {
    pinia,
    services: {
      sms: {
        sendSms(params) {
          return request.post("/api/sms/send", params);
        },
        verifySms(params) {
          return request.post("/api/sms/verify", params);
        },
      },
      auth: {
        loginByPhone(params) {
          return request.post("/api/auth/login-by-phone", params);
        },
        loginByPassword(params) {
          return request.post("/api/auth/login-by-password", params);
        },
      },
      weixin: {
        getPhoneInfoByCode(params) {
          return request.post("/api/weixin/phone", params);
        },
        loginByWeixin(params) {
          return request.post("/api/weixin/login", params);
        },
      },
    },
    hooks: {
      onLoginSuccess(payload, context) {
        console.log("登录成功", payload, context);
      },
    },
  });

  return {
    app,
    Pinia,
  };
}
// #endif
