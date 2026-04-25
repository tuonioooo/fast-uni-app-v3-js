// #ifdef VUE3
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import uvUI from '@climblee/uv-ui';
import Request from '@/util/request/index';
import ConstantsPlugin from '@/common/plugins/constants';
import jasper from '@/uni_modules/jasper-ui';
import jasperLogin from '@/uni_modules/jasper-login';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();

  app.use(uvUI);
  app.use(jasper);
  app.use(pinia);
  app.use(Request);
  app.use(ConstantsPlugin);
  app.use(jasperLogin, {
    pinia,
    whiteList: ['/pages/index/index', '/pages/user/user', '/pages/component-test/component-test'],
  });

  return {
    app,
    Pinia,
  };
}
// #endif
