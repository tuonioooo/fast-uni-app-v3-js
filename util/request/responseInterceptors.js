/**
 * 响应拦截
 * @param vm
 */
export default (vm) => {
	uni.$uv.http.interceptors.response.use((response) => { // 对响应成功做点什么 可使用async await 做异步操作
		const data = response.data
		// 自定义参数
		const { custom } = response.config;
		const { ignoreCheck } = custom;
		if (response.config?.custom?.baseURL == '') { //如果配置的第三方服务域名 直接返回结果
			return data || {};
		}
		if (ignoreCheck) { //忽略错误检测，直接返回结果
			return data;
		}
		if (data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				uni.showToast({
					title: data.msg,
					icon: 'none',
				})
			}
			if (custom?.body) { // 如果配置body 优先返回响应体
				return custom?.body ? data : data.data || {}
			}
			if (custom?.catch) {  // 如果需要catch返回，则进行reject
				return Promise.reject(data)
			} else {
				return new Promise(() => { })  // 否则返回一个pending中的promise
			}
		}
		//如果配置了custom.body 将返回整个响应请求， 否则则返回 对应data部分
		return custom?.body ? data : data.data || {}
	}, (errorRes) => { //  对响应错误做点什么 （http.statusCode !== 200）、超时、请求中断，服务器异常或者宕机
		console.error(errorRes);
		uni.showToast({ //加载失败，错误提示信息
			title: '加载失败',
			icon: 'none',
		})
		return Promise.reject(errorRes)
	})
}