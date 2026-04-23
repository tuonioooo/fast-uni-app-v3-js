
/**
 * 去掉中文字符
 * @param {Object} value
 */
function removeChinese(value) {
    return value.replace(/[\u4E00-\u9FA5]+/gm, "");
}

/**
 * 转义元字符
 * @param {Object} input
 */
function escapeMetacharacter(input) {
    var metacharacter = "^$()*+.[]|\\-?{}|";
    if(metacharacter.indexOf(input) >= 0) {
      input = "\\" + input;
    }
    return input;
}

/**
 * 转义字符串中的元字符
 * @param {Object} input
 */
function escapeMetacharacterOfStr(input) {
    return input.replace(/[\^\$\*\+\.\|\\\-\?\{\}\|]/gm, "\\$&");
}

/**
 * 字符串反转
 */
function reverse(value) {
    if(this.empty(value)) {
      value;
    }
    return value.split("").reverse().join("");
}

/**
 * 删掉特殊字符(英文状态下)
 */
function removeSpecialCharacter(value) {
    return value.replace(/[!-/:-@\[-`{-~]/g, "");
}

/**
  * 把连续出现多次的字母字符串进行压缩。如输入:aaabbbbcccccd 输出:3a4b5cd
  * @param {String} input
  * @param {Boolean} ignoreCase : true or false
  */
function compressRepeatedStr(input, ignoreCase) {
    var pattern = new RegExp("([a-z])\\1+", ignoreCase ? "ig" : "g");
    return input.replace(pattern, function(matchStr, group1) {
      return matchStr.length + group1;
    });
}
/**
 * 字符串转换UTF-8编码
 * @param {*} input 
 */
function str2rstrUTF8(input) {
	return unescape(encodeURIComponent(input))
}

export {
	removeChinese,
	escapeMetacharacter,
	escapeMetacharacterOfStr,
	reverse,
	removeSpecialCharacter,
	compressRepeatedStr,
	str2rstrUTF8
}