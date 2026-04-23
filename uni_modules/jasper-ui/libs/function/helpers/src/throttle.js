let timer, flag;
import {isFn} from '../../validate/index';
import {getValue} from '../../../config/index';
/**
 * 节流原理：在一定时间内，只能触发一次
 * 
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
function throttle(func, wait = getValue('throttle') || 500, immediate = true) {
	if (immediate) {
		if (!flag) {
			flag = true;
			// 如果是立即执行，则在wait毫秒内开始时执行
			typeof func === 'function' && func();
			timer = setTimeout(() => {
				flag = false;
			}, wait);
		}
	} else {
		if (!flag) {
			flag = true
			// 如果是非立即执行，则在wait毫秒内的结束处执行
			timer = setTimeout(() => {
				flag = false
				typeof func === 'function' && func();
			}, wait);
		}
	}
};

/**
 * @description 节流，每隔一定时间执行一次，在此期间仅执行一次
 * @param {Function} fn 即将执行的函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} isTail 是否在时间段结尾执行
 * @param {Function} fn
 */
function throttleReturnFun(fn , wait= getValue('throttle') || 500, isTail ) {
	let isAvail = true , timeout = null , isFirst = true , movement = null;
	return function() {
		let context = this , args = arguments ;
		if (isTail) {
			if (null == timeout) {
				timeout = setTimeout(() => {
					timeout = null ;
					isFn(fn) && fn.apply(context, args) ;
				}, wait) ;
			}
		} else { //立即执行
			if (isAvail) {
				isAvail = false ;
				isFn(fn) && fn.apply(context, args);
				setTimeout(()=>{
					isAvail = true ;
				}, wait);
			}
		}
		if (isFirst) { //防止只点击一次时触发两次的情况
			isFirst = false ;
			return ;
		}
		//最后一次必定执行
		clearTimeout(movement);
		movement = setTimeout(()=>{
			isFn(fn) && fn.apply(context, args) ;
		} , wait );
	}
}

export  {
	throttle, throttleReturnFun
}
