/** 引入全局mixin */
import mixin from './libs/mixin/mixin.js'
/** 小程序特有的mixin */
import mpMixin from './libs/mixin/mpMixin.js'
/** 开发相关工具类函数 */
import * as helpers from "./libs/function/helpers/index.js" ;
/** 操作json对象相关函数 */
import * as objects from "./libs/function/object/index.js" ;
/** 类型验证函数 */
import * as validate from "./libs/function/validate/index.js" ;
/** 全局配置文件 */
import * as config from "./libs/config/index.js" ;
/** dayjs日期工具类 */
import timeByDayjs from "./libs/function/helpers/src/timeByDayjs.js";

const $jasper = {
	...config,
	...validate,
	...objects,
	...helpers,
	mixin,
	mpMixin,
	timeByDayjs,
	theme: {
		//返回主题色配置
		...config.getValue("theme")
	},
	isLogin(){
		let fn = config.getValue("isLogin")
		return validate.isFn(fn) && fn();
	},
	toLogin() {
		uni.navigateTo({
			url: '/uni_modules/jasper-login/pages/login/login-withoutpwd',
			success: res => {},
			fail: () => {},
			complete: () => {}
		});
	},
	async hasNetwork(){
		let res = await helpers.getNetworkType()
		return res.networkType !== 'none'
	},
}

/**
 * jasper-ui 插件
 * 用于在Vue应用中全局注册常量，便于在各个组件中访问。
 * 支持通过app.config.globalProperties和uni对象访问常量。
 *
 * @param {Object} app - 当前应用实例。
 * @param {Object} config - 扩展插件的配置对象。
 */
const install = (app, config) => {
	let mode = 'v3';
	// 挂载api到全局对象上
	if (app.config && app.config.globalProperties) {
		// Vue 3
		mode = 'v3';
		app.config.globalProperties.$jasper = $jasper;
	} else if (app.prototype) {
		// Vue 2
		mode = 'v2';
		app.prototype.$jasper = $jasper;
	}
	// 挂载到uni对象上
	uni.$jasper = $jasper;	//全平台支持
	console.log('%c【jasper-ui安装成功,当前环境是' + mode + '编译模式】', 'color:green; font-weight:bold;');
}

export default {
	install 
}