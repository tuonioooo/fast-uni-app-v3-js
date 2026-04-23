import {toUrl} from "../index.js" ;

function to ( config = {} , name ) {
	name = name || 'navigateTo' ;
	let { url , params , keepKeys} = config ;

	if (name == 'navigateBack') {
		return navigateBack(config) ;
	}
	url = toUrl( url , params , keepKeys );

	let data = {
		url ,
		fail:(e) => {
			if (e.errMsg && e.errMsg.indexOf("tabbar") > -1) {
				to({ url }, 'switchTab') ;
				return ;
			}
			console.log("e: ",e);
		}
	} ;

	if (name == 'navigateTo') {
		uni.navigateTo(data);
	}else if (name == 'redirectTo') {
		uni.redirectTo(data);
	}else if (name == 'reLaunch') {
		uni.reLaunch(data);
	}else{
		uni.switchTab({
			url ,
			fail:(e) => {
				console.error(e);
			}
		})
	}
}

function navigateBack ( config = {} ) {
	let { delta = 1 , title , url } = config ;

	//返回上一页或默认页
	if ( getCurrentPages().length <= delta && url ) {
		if(!config.openType || config.openType == "navigateBack") config.openType = "redirectTo" ;
		open(config) ;
	}else{
		uni.navigateBack({delta});
	}

	//返回上一页，并显示提示信息
	if (title) {
		setTimeout(e => {
			uni.showToast({
				title: title ,
				icon : 'success'
			});
		},200);
	}
}

function openUrl (url , openType, pageWebViewUrl = '/pages/webview/webview') {
	// #ifdef H5
	window.open(url , openType == '_blank' ? '_blank' : '_self' ) ;
	// #endif


	// #ifndef H5
	to({
		url : pageWebViewUrl ,
		params : {
			src : encodeURIComponent(url)
		}
	})
	// #endif
}

/**
 * 打开页面或进行页面跳转操作的函数。
 *
 * @param {Object} config - 配置对象
 * @param {string} config.url - 要跳转的 URL 地址。若 openType 不是 'navigateBack' 且 url 未定义，函数会发出警告。
 * @param {string} config.openType - 打开方式类型，支持以下值：
 *   - 'navigateTo'：保留当前页面，跳转到应用内的某个页面。使用 `wx.navigateTo`，但不能跳转到 tabBar 页面。
 *   - 'redirectTo'：关闭当前页面，跳转到应用内的某个页面。使用 `wx.redirectTo`，但不能跳转到 tabBar 页面。
 *   - 'reLaunch'：关闭所有页面，重新打开应用内的某个页面。使用 `wx.reLaunch`，可以跳转到 tabBar 页面。
 *   - 'switchTab'：跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。使用 `wx.switchTab`。
 *   - 'navigateBack'：关闭当前页面，返回上一个页面。
 *   - '_self'：在 H5 平台中，表示在当前窗口打开，其他平台会转换为 'redirectTo'。
 *   - '_blank'：在 H5 平台中，表示新窗口打开，其他平台会转换为 'navigateTo'。
 * @param {Object} config.params - 携带的查询参数对象，参数会自动拼接到 URL 中。
 * @param {Array} config.keepKeys - 在查询参数中需要保留的 key 列表，其他参数会被过滤掉。
 */
function open (config = {}) {
	let { url , openType , params , keepKeys } = config ;
	if (!url && openType != 'navigateBack') {
		console.warn("url is undefined") ;
		return ;
	}

	// #ifdef H5
	if ( openType == '_blank' ) {
		if ( url.indexOf("http") !== 0 ) {
			let rootPath = location.href.split("#")[0] ;
			url = `${rootPath}#${url}` ;
		}
	}
	// #endif

	// #ifndef H5
	if ( openType == "_blank" ) {
		openType = "navigateTo" ;
	}else if (openType == '_self') {
		openType = "redirectTo" ;
	}
	// #endif

	let isUrls = url.indexOf("http") == 0 ;
	if (isUrls) {
		url = toUrl( url , params , keepKeys );
		openUrl(url ,  openType );
		return ;
	}

	to( config , openType );
}

function systemNav(isShow){
	// #ifdef APP-PLUS
	if (isShow) {
		plus.navigator.hideSystemNavigation();
	}else{
		plus.navigator.showSystemNavigation();
	}
	// #endif
}

function navigateTo (config) {
	to(config , "navigateTo");
}

function redirectTo (config) {
	to(config , "redirectTo");
}

function reLaunch (config) {
	to(config , "reLaunch");
}

/**
 * @description 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
 * @param config
 */
function switchTab (config) {
	to(config , "switchTab");
}

export {
	navigateTo ,
	redirectTo ,
	reLaunch ,
	switchTab ,
	navigateBack ,
	open,
	systemNav
}