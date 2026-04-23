
/**
 * @description 请求拦截
 * @param {Object} http
 */
export default (vm) => {
	uni.$uv.http.interceptors.request.use(async (config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		// 自定义第三方服务器域名 将不使用全局根域名的配置
		config.data = config.data || {}
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if (config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			// config.header.token = vm.$store.state.userInfo.token
		}
		// 拦截处理
		return config
	}, (config) => // 可使用async await 做异步操作
		Promise.reject(config))
};
