// #ifdef VUE3
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import uvUI from '@climblee/uv-ui';
import Request from '@/util/request/index';
import ConstantsPlugin from '@/common/plugins/constants';
import jasper from '@/uni_modules/jasper-ui';

export function createApp() {
  const app = createSSRApp(App);

  app.use(uvUI);
  app.use(jasper);
  app.use(Pinia.createPinia());
  app.use(Request);
  app.use(ConstantsPlugin);

  return {
    app,
    Pinia,
  };
}
// #endif
