import {isEmpty, isNumber} from "../../validate/src/type.js" ;

/**
 * @description 将json属性升序 排序
 * @param {Object} jsonObj
 */
function toAscSort(jsonObj) {
	let arr = new Array();
	let num = 0;
	for (let i in jsonObj) {
		arr[num] = i;
		num++;
	}
	let sortArr = arr.sort();
	let sortObj = {};
	for (let i in sortArr) {
		sortObj[sortArr[i]] = jsonObj[sortArr[i]];
	}
	return sortObj;
}

/**
 * @description 将json属性降序 排序
 * @param {Object} jsonObj
 */
function toReverseSort(jsonObj) {
	let arr = new Array();
	let num = 0;
	for (let i in jsonObj) {
		arr[num] = i;
		num++;
	}
	let sortArr = arr.reverse();
	let sortObj = {};
	for (let i in sortArr) {
		sortObj[sortArr[i]] = jsonObj[sortArr[i]];
	}
	return sortObj;
}
/**
 * @description 将json的value值转换成字符串
 * @param {*} jsonObj 
 */
function valueToStr(jsonObj) {
	if(isEmpty(jsonObj)) return {};
	for (let i in jsonObj) {
        jsonObj[i] = jsonObj[i]+'';
	}
	return jsonObj;
}

export {
	toAscSort,
	toReverseSort,
	valueToStr
}