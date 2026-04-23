import RequestInterceptors from '@/util/request/requestInterceptors';
import ResponseInterceptors from '@/util/request/responseInterceptors';

export default (vm) => {
	// 初始化请求配置
	uni.$uv.http.setConfig((defaultConfig) => {
		defaultConfig.baseURL = import.meta.env.VITE_BASE_URL /* 根域名 */
		return defaultConfig
	})

	// 引入请求拦截
	RequestInterceptors(vm);

	// 引入响应拦截
	ResponseInterceptors(vm);
}
