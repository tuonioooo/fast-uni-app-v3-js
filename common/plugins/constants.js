const API_VERSION = 'v1';

/**
 * 常量插件
 * 用于在Vue应用中全局注册常量，便于在各个组件中访问。
 * 支持通过app.config.globalProperties和uni对象访问常量。
 *
 * @param {Object} app - 当前应用实例。
 * @param {Object} process - 环境变量和应用运行模式信息，参考：https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#环境变量
 *
 * 常量获取用法：
 *
 * 一、通过app.config.globalProperties配置的全局常量（全平台支持）：
 *   1. 在setup()函数内：
 *      const instance = getCurrentInstance();
 *      const globalConstants = instance.appContext.config.globalProperties.$constants;
 *   2. 在setup()函数外：
 *      export default {
 *        mounted() {
 *          console.log(this.$constants.MY_CONSTANT);  // 输出: Hello, Vue 3!
 *        }
 *      };
 *
 * 二、通过uni对象挂载的常量（全平台支持）：直接使用uni.$constants即可。
 */
const ConstantsPlugin = (app) => {
  const envStatic = {
    STATIC_HOST: import.meta.env.VITE_STATIC_HOST,
    BASE_URL: import.meta.env.VITE_BASE_URL,
    UNI_PLATFORM: process.env.UNI_PLATFORM,
  };

  const apiStatic = {
    RESULT_SUCCESS_CODE: 200,
    AUTHORIZATION_OFFLINE_CODE: 402,
    RESULT_FAIL_CODE: 0,
    LOGIN_PAGE_PATH: '/uni_modules/jasper-login/pages/login/login-withoutpwd',
    API_VERSION,
  };

  const $constants = {
    ...apiStatic,
    ...envStatic,
    LOAD_ERROR_TEXT: '加载失败,请点击重试',
  };

  app.config.globalProperties.$constants = $constants; //nvue页面不支持
  uni.$constants = $constants; //全平台支持
  uni.$jasper.$constants = $constants;

  console.log(
    `成功配置全局常量插件,当前编译平台=${uni.$jasper.$constants.UNI_PLATFORM}, 环境变量=${import.meta.env.VITE_STATIC_HOST}`
  );
};

export default ConstantsPlugin;
