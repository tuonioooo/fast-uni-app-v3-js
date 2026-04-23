// #ifdef VUE3
import { createSSRApp } from "vue";
import * as Pinia from 'pinia'; // vue-cli 用法 目前版本固定2.0.36，其它可能会不兼容
import App from "./App.vue";
import uvUI from '@climblee/uv-ui';
import Request from '@/util/request/index';
import ConstantsPlugin from '@/common/plugins/constants';
import jasper from '@/uni_modules/jasper-ui';


export function createApp() {
  const app = createSSRApp(App);
  app.use(uvUI);	// 引入uv-ui
  app.use(jasper); //安装jasper-ui插件
  app.use(Pinia.createPinia()); //安装状态管理插件
  app.use(Request); // 引入请求工具类封装
  app.use(ConstantsPlugin); //安装常量插件，并注入环境变量
  return {
    app,
    Pinia
  };
}
// #endif