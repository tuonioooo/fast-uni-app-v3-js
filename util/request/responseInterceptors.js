/**
 * 响应拦截
 */
export default () => {
  uni.$uv.http.interceptors.response.use(
    (response) => {
      const data = response.data || {};
      const custom = response.config?.custom || {};
      const successCode = uni.$constants?.RESULT_SUCCESS_CODE || 200;
      const authOfflineCode = uni.$constants?.AUTHORIZATION_OFFLINE_CODE || 402;
      const loginPagePath =
        uni.$constants?.LOGIN_PAGE_PATH || '/uni_modules/jasper-login/pages/login/login-withoutpwd';

      if (custom.ignoreCheck) {
        //忽略错误检测，直接返回结果
        return data;
      }
      if (data.code !== successCode) {
        const msg =
          data.msg || data.message || uni.$constants?.LOAD_ERROR_TEXT || '加载失败,请稍后重试';

        if (data.code === authOfflineCode) {
          const tokenKey = uni.$jasper.getValue('tokenKey');
          const tokenExpiredKey = uni.$jasper.getValue('tokenExpiredKey');
          uni.removeStorageSync(tokenKey);
          uni.removeStorageSync(tokenExpiredKey);

          const pages = getCurrentPages();
          const currentRoute = pages[pages.length - 1]?.route;
          const loginRoute = loginPagePath.replace(/^\//, '');

          if (currentRoute !== loginRoute) {
            uni.navigateTo({
              url: loginPagePath,
            });
          }
        }

        if (custom.toast !== false) {
          uni.showToast({
            title: msg,
            icon: 'none',
          });
        }

        return Promise.reject(data);
      }

      return custom.body ? data : data.data || {}; // 如果配置了custom.body 将返回整个响应请求， 否则则返回 对应data部分
    },
    (errorRes) => {
      console.error(errorRes);
      uni.showToast({
        title: uni.$constants?.LOAD_ERROR_TEXT || '加载失败,请点击重试',
        icon: 'none',
      });
      return Promise.reject(errorRes);
    }
  );
};
