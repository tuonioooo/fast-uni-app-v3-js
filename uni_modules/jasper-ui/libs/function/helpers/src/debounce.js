let timeout = null;
import {isFn} from '../../validate/index';
import {getValue} from '../../../config/index';

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
function debounce(func, wait = getValue('debounce') || 500, immediate = false) {
    // 清除定时器
    if (timeout !== null) clearTimeout(timeout);
    // 立即执行，此类情况一般用不到
    if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(function() {
            timeout = null;
        }, wait);
        if (callNow) typeof func === 'function' && func();
    } else {
        // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
        timeout = setTimeout(function() {
            typeof func === 'function' && func();
        }, wait);
    }
}

/**
 * @description 防抖，函数在延时时间内只执行一次，如在此期间多次触发，则延时时间重新计时。
 * @param {Function} fn 要执行的回调函数
 * @param {Number} wait 延时的时间，单位ms
 * @return {Function} 返回执行函数
 */
function debounceReturnFun( fn , wait = getValue('debounce')  || 500, immediate ) {
    let timeout;
    return function() {
        let context = this , args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) isFn(fn) && fn.apply(context, args);
        };
        var callNow = immediate && !timeout ;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) isFn(fn) && fn.apply(context, args);
    };
}


export {
    debounce, debounceReturnFun
}
