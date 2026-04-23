


import {isNull , isTrue , isString, isNumber} from "../../validate/src/type.js" ;

/**
 * @description 函数杂项功能汇总
 */

/**
 * @description 如果value小于min，取min；如果value大于max，取max
 * @param {number} min 
 * @param {number} max 
 * @param {number} value
 */
function range(min = 0, max = 0, value = 0) {
	return Math.max(min, Math.min(max, Number(value)))
}

/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit 
 * @returns {number|string}
 */
function getPx(value, unit = false) {
	if (isNumber(value)) {
		return unit ? `${value}px` : Number(value)
	}
	// 如果带有rpx，先取出其数值部分，再转为px值
	if (/(rpx|upx)$/.test(value)) {
		return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
	}
	return unit ? `${parseInt(value)}px` : parseInt(value)
}

function sleep (time = 1000) {
	return new Promise((resolve) => {
		setTimeout(resolve , time);
	});
}
/**
 * @description 判断当前为开发环境
 * @return {Boolean} 是否为开发环境
 */
function isDev(){
	return process.env.NODE_ENV === 'development' ;
}

function log(){
	if (isDev()) {
		console.log(...arguments) ;
	}
}

function getLocalData (key , defaultValue) {
	let data = uni.getStorageSync(key) ;
	return isNull(data) ? defaultValue : data ;
}

/**
 * @description 显示提示信息
 */
function showTips(msg , icon = 'none', duration){
	if (!msg) {
		return ;
	}
	if (msg.length < 15) {
		uni.showToast({
			title: msg ,
			icon ,
			duration: msg.length > 5 ? 3000 : 2000
		});
		return ;
	}
	showModal({
		content: msg ,
		showCancel:false
	});
}


function showToast(msg , icon = 'none'){
	showTips(msg , icon);
}
/**
 * 显示消息提示框
 * @param {String} title 提示的内容，长度与 icon 取值有关。
 * @param {Number} duration 提示的延迟时间，单位毫秒，默认：2000
 */
function toast(title, duration = 2000) {
	showTips(title , 'none', duration);
}

/**
 * @description 显示模态框
 */
function showModal(config={}){
	let _config = {
		title : '提示'
	};
	if(!isNull(uni.$jasper.theme['$jasper-primary'])){
		_config.confirmColor = uni.$jasper.theme['$jasper-primary']
	}
	uni.showModal(Object.assign(_config , config));
}

/**
 * @description 将一个度量数值转为px
 * @param {String} value 数值，px、upx、rpx、%等
 * @param {Number} fatherSize 参考父级尺寸
 */
function parsePx(value , fatherSize ){
	if (isNull(value) || value == 'auto') {
		return "" ;
	}
	let { width , height } = uni.$jasper.getSafeArea() ;
	fatherSize = fatherSize || width ;
	value = value + '' ;
	let v = parseFloat(value) ;
	if (value.indexOf("%") > -1) {
		value = fatherSize * v / 100 ;
	}else if (value.indexOf("vw") > -1) {
		value = width * v / 100 ;
	}else if (value.indexOf("vh") > -1) {
		value = height * v / 100 ;
	}else if (value.indexOf("upx") > -1 || value.indexOf("rpx") > -1) {
		value = width > 476 ? v/2 : v / 2 * (width / 375) ;
	}
	let intValue = parseInt(value) ;
	return intValue % 2 == 0 || intValue === value  ? intValue : intValue + 1 ;
}

function getSafeArea(){
	let sysInfo = uni.getSystemInfoSync() ;
	// #ifdef H5 
	return sysInfo.safeArea ;
	// #endif
	// #ifndef H5 
	return { width : sysInfo.windowWidth , height : sysInfo.windowHeight } ;
	// #endif
}


function hasSlots(name){
	// #ifdef MP-ALIPAY
	if(!my.canIUse("component2")){
		console.error("未启用component2编译，请点击开发工具右上角的详情按钮，在项目配置中开启。");
	}
	name = name ? name : "$default" ;
	return ( !!this.$slots && !!this.$slots[name] && this.$slots[name].length > 0) || ( !!this.$scopedSlots && !!this.$scopedSlots[name] && this.$scopedSlots[name].length > 0) ;
	// #endif
	// #ifndef MP-ALIPAY
	name = name ? name : "default" ;
	return !!this.$slots[name] || !!this.$scopedSlots[name] ;
	// #endif
}

function getSlots () {
	return [...arguments].reduce( (data , name) => {
		data[name] = hasSlots.call(this , name) ;
		return data ;
	},{});
}

/**
 * @@description 返回当前对象 属性值 true or false
 * @example {circular: false, indicatorDots: false, autoplay: false}
 */
function getTrues () {
	return [...arguments].reduce( (data , name) => {
		data[name] = isTrue(this[name]) ;
		return data ;
	},{});
}

function getNumbers () {
	return [...arguments].reduce( (data , name) => {
		data[name] = Number(this[name]) ;
		return data ;
	},{});
}

async function getTempFileUrl (fileID) {
	if (!fileID || fileID.indexOf("cloud://") != 0) {
		return fileID ;
	}
	let {fileList} = await uniCloud.getTempFileURL({fileList : [fileID]});
	let {code , tempFileURL} = fileList[0] ;
	if (code == "STORAGE_EXCEED_AUTHORITY") {
		console.error("该fileID不是当前客户端环境生成，需在服务端获取临时链接");
	}
	return !!tempFileURL ? tempFileURL : fileID ;
}

async function getTempFileURL (fileID) {
	if (!fileID) {
		return fileID ;
	}
	if (isString(fileID)) {
		return await getTempFileUrl(fileID);
	}
	let promises = fileID.map(item => getTempFileUrl(item));
	return await Promise.all(promises);
}
/**
 * @description 运行期判断平台
 * @returns {string} 返回所在平台(小写) 
 * @link 运行期判断平台 https://uniapp.dcloud.io/frame?id=判断平台
 */
function os() {
	return uni.getSystemInfoSync().platform.toLowerCase()
}
/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync 
 */
function sys() {
	return uni.getSystemInfoSync()
}
/**
* @description 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
   this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
   这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
   值(默认为undefined)，就是查找最顶层的$parent
*  @param {string|undefined} name 父组件的参数名
*/
function $parent(name = undefined) {
	let parent = this.$parent
	// 通过while历遍，这里主要是为了H5需要多层解析的问题
	while (parent) {
		// 父组件
		if (parent.$options && parent.$options.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent
		} else {
			return parent
		}
	}
	return false
}

export {
	range,
	getPx,
	sleep ,
	getTempFileURL ,
	isDev ,
	log ,
	showTips ,
	showToast ,
	toast,
	showModal ,
	parsePx ,
	getSafeArea ,
	getLocalData ,
	hasSlots ,
	getSlots ,
	getTrues ,
	getNumbers,
	os,
	sys,
	$parent,
}