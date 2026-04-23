import {clone} from "./object.js" ;

/**
 * @description 简单的数组合并、去重
 * @example
 *  var m = [1, 2, 2], n = [2,3,3]; 
 *  console.log(combine(m)); // [1, 2]
 *	console.log(combine(m,n)); // [1, 2, 3]
 */
export function combine() {
	let arr = [].concat.apply([], arguments);
	return Array.from(new Set(arr));
}

/**
 * 将值转为数组
 * @param {Object} value
 */
export function parseArray (value , spliter = ',') {
	if (uni.$unc.isNull(value)) {
		return [] ;
	}
	if (uni.$unc.isArray(value)) {
		return clone(value) ;
	}
	value += "" ;
	return uni.$unc.isArrayStr(value) ? JSON.parse(value) : value.split(spliter) ;
}
/**
 * 根据范围值的大小 创建一个范围数组
 * @example let result = createRangeArray(1, 6) // [1, 2, 3, 4, 5, 6]
			let result = createRangeArray(1, 6, false) // [1, 2, 3, 4, 5]
 * @param {*} start 	开始
 * @param {*} end 		结束
 * @param {*} closed 	是否闭合 默认闭合
 */
export function createRangeArray(start, end, closed=true){
	if(!uni.$unc.isInt(start) || !uni.$unc.isInt(start)){
		return []
	}
	if(start < 0 || end <0){
		return []
	}
	if(start > end){
		let temp = start;
		start = end;
		end = temp;
	}
	if(start === end){
		return [0]
	}
	let value = closed ? 1 : 0 ;
	const range = (start, end, value) => Array(end - start + value).fill(0).map((v, i) => i + start);
	return range(start, end, value);
}