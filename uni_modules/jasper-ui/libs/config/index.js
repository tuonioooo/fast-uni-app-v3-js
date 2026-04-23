
import {deepMerge , getDeepVal} from "../function/object/src/object.js" ;


const config = {
	tokenKey: 'jasper-user-token',
	tokenExpiredKey : "jasper-user-token-expired" ,
	
	//全局登录校验
	isLogin(){
		//本地token
		let tokenExpired = uni.getStorageSync(getValue("tokenExpiredKey"));
		//登录过期时间
		let token = uni.getStorageSync(getValue("tokenKey"));
		return !!token && tokenExpired > Date.now() ;
	},
	
	//主题色配置
	//为了解决uni-app app-plus编译模式下 scss 主题变量不能使用:export 的候补方法（uni-app 官方bug）
	theme: {
		// 主色
		'$jasper-primary': '#feda33', 					//主色(一般用于背景色)
		'$jasper-primary-dark': '#dbb733', 				//暗主色(一般用于背景色)
		'$jasper-primary-disabled': '#fad43b',
		'$jasper-primary-light': '#faefbf',  			//亮主色(一般用于背景色)
		'$jasper-primary-deep': '#fca000',  				//主色文本
		'$jasper-primary-inverse': '#000000', 			//主色搭配的反色 (用于文本居多)

		// 文本颜色
		// 中性色用于文本、背景和边框颜色。通过运用不同的中性色，来表现层次结构。
		'$jasper-main-color': '#3a3a3a', 				// 主要文字
		'$jasper-content-color': '#606266',
		'$jasper-tips-color': '#909193',
		'$jasper-light-color': '#c0c4cc',
		'$jasper-disabled-color': '#c8c9cc',
		'$jasper-secondary-color': '#909399',	    	// 次要文字
		'$jasper-extra-color': '#c7c7c7',				// 辅助说明

		//边框颜色
		'$jasper-border-color': '#fca000', 				//边框颜色
		'$jasper-border-1': '#F0F0F0',    				//1级边框
		'$jasper-border-2': '#EDEDED',     				//2级边框
		'$jasper-border-3': '#DCDCDC',      			//3级边框
		'$jasper-border-4': '#B9B9B9',      			//4级边框

		//背景色
		'$jasper-bg-color': '#f3f4f6',

		confirmColor: "#ff9800", //弹窗确认按钮的文字颜色

	},
	
	//组件配置
	components : {
		price:{
			'unit': '元',
			'prefix': '¥',
			'suffix': '元'
		},
		contentText: {
			contentdown: "上拉显示更多",
			contentrefresh: "正在加载...",
			contentnomore: "已显示全部数据",
			contenterror: "加载异常,请点击重试"
		},
		fontSize: { // 字体组件范围设置
			min: 12,
			step: 2,
			max: 40,
		}
	},

	//缓存key配置
	caches: {},

	//页面常量配置, 需要与pages.json同步 注意：配置的原因时因为页面会有多处重复使用这些字符串，这里统一配置避免重复代码,路径前一定要加 “/”
	pages: {},

	debounce: 500, //默认防抖间隔
	throttle: 500, //默认节流间隔
	
	request:{},
	response:{},
}

/**
 * @description 配置全局配置信息
 */
function setConfig(myConfig = {}){
	deepMerge(config , myConfig) ;
}


/**
 * @description 从配置信息中取值
 * @param {Object} keys 取值路径，多个使用英文.连接
 * @param {Object} defaultValue 可选参数，若不存在时，赋予并返回默认值
 */
function getValue(keys , defaultValue){
	return getDeepVal(config , keys , defaultValue ) ;
}

export {
	setConfig ,
	getValue
};