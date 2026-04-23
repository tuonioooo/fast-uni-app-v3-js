/**
 * @description 请求拦截
 */
export default () => {
  uni.$uv.http.interceptors.request.use(
    async (config) => {
      config.data = config.data || {};
      config.header = config.header || {};

      if (config?.custom?.auth) {
        const token = uni.getStorageSync(uni.$jasper.getValue('tokenKey'));
        if (token) {
          config.header.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (config) => Promise.reject(config)
  );
};
