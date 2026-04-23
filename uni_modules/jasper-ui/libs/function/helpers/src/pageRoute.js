import { toParams } from "../index.js" ;

/**
 * @description 获取当前页面对象
 * @return {*}
 */
function getCurrentPage() {
	// 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
	let pages = getCurrentPages();
	if (pages.length === 0) {
		return;
	}
	return pages[pages.length - 1];
}

/**
 * @description 获取当前页面对象 包含路径、参数、路由
 * @return {Object} path , params , path
 */
function getPage() {
	let curPage = getCurrentPage();
	if (!curPage) {
		return {};
	}
	let params = curPage.options;
	let route = curPage.route || curPage.$page.route; //考虑兼容性
	let path = route;
	let kv = toParams(params);
	route = kv ? path + "?" + kv : path;
	return { path, params, route };
}

/**
 * 获取页面的参数
 * @param {Object} e
 */
function getPageParams(e) {
	return (getPage()).params;
}

/**
 * @description 获取当前页面含参数的完整路由
 * @return {String} 返回/pages/xxx/xxx?k=v形式的字符串，当前页面路径
 */
function getPageRoute() {
	let page = getPage();
	return page.route;
}

/**
 * @description 获取当前页面路径
 * @param e
 * @return {string}
 */
function getPagePath(e) {
	return (getPage()).path;
}

/**
 * @description 获取当前页面的 Vue 实例
 * @return {object}
 */
function getVm () {
	let page = getCurrentPage() ;
	return page ? page.$vm : null ;
}

/**
 * @description 获取WebView对象
 * @return {*}
 */
function getAppWebview () {
	let page = getCurrentPage() ;
	return page.$getAppWebview();
}

export { getPage, getPageParams, getPageRoute, getPagePath, getVm, getAppWebview};
