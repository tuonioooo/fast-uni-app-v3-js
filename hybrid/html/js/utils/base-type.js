/**
 * @description 判断是否为身份证号码
 * @param {String} maybeIdcard
 */

/**
 * @description 判断变量值为空
 * @param {String | Number | Boolean} maybeNull
 * @return {Boolean} 值为undefined、null、""、NaN时返回true
 */
function isNull(maybeNull) {
  return maybeNull === undefined || maybeNull === '' || maybeNull === null || maybeNull === NaN;
}

/**
 * @description 判断变量不为空值
 */
function notNull(v) {
  return !isNull(v);
}

/**
 * @description 判断为空值，包括空数组和空json
 * @param {Object} maybeEmpty
 */
function isEmpty(maybeEmpty) {
  if (isArray(maybeEmpty)) {
    return maybeEmpty.length == 0;
  }
  if (isObject(maybeEmpty)) {
    return isEmptyObject(maybeEmpty);
  }
  return isNull(maybeEmpty);
}

/**
 * @description 判断字符串类型或布尔值类型的true
 * @param {String | Boolean} maybeTrue
 */
function isTrue(maybeTrue) {
  return maybeTrue === true || maybeTrue === 'true';
}

/**
 * @description 是否可以转为布尔值
 * @param {String | Boolean | Number} maybeTrue
 */
function isUnstrictTrue(maybeTrue) {
  return isTrue(maybeTrue) || maybeTrue === 1 || maybeTrue === '1';
}

/**
 * @description 判断字符串或布尔值类型的false
 * @param {String | Boolean} maybeFalse
 */
function isFalse(maybeFalse) {
  return maybeFalse === false || maybeFalse === 'false';
}

/**
 * @description 是否可以转为布尔值true，若为数字0也为false
 * @param {String | Boolean | Number} maybeFalse
 */
function isUnstrictFalse(maybeTrue) {
  return isFalse(maybeTrue) || maybeTrue === 0 || maybeTrue === '0';
}

/**
 * @description 判断是否为布尔值
 * @param {Object} maybeFalse
 */
function isBoolean(maybeBoolean) {
  return isTrue(maybeBoolean) || isFalse(maybeBoolean);
}

/**
 * @description 判断是否为布尔值，包括数字1/0
 * @param {Object} maybeFalse
 */
function isUnstrictBoolean(maybeBoolean) {
  return isUnstrictTrue(maybeBoolean) || isUnstrictFalse(maybeBoolean);
}

/**
 * @description 判断为Symbol类型
 * @param {Object} maybeSymbol
 */
function isSymbol(maybeSymbol) {
  return Object.prototype.toString.call(maybeSymbol) === '[object Symbol]';
}

/**
 * @description 判断变量是否为json对象
 * @param {Object} maybeJson
 * @return {Boolean} 为json时返回true
 */
function isObject(maybeJson) {
  return Object.prototype.toString.call(maybeJson) === '[object Object]';
}

/**
 * @description 判断是否是json对象且无键值对
 * @param {Object} maybeEmptyJson
 * @return {Boolean} 是json对象且为空时返回true
 */
function isEmptyObject(maybeEmptyJson) {
  return isObject(maybeEmptyJson) && Object.keys(maybeEmptyJson).length == 0;
}

/**
 * @description 判断是否为数组
 * @param {Array} maybeArr
 * @return {Boolean} 是否为数组
 */
function isArray(maybeArr) {
  return (
    (typeof Array.isArray === 'function' && Array.isArray(maybeArr)) ||
    Object.prototype.toString.call(maybeArr) === '[object Array]'
  );
}

/**
 * @description 判断是否为数组字符串
 * @param {String} maybeArrayStr
 */
function isArrayStr(maybeArrayStr) {
  if (!isString(maybeArrayStr)) {
    return false;
  }
  try {
    return isArray(JSON.parse(maybeArrayStr));
  } catch (e) {
    return false;
  }
}

/**
 * @description 判断是否为字符串
 * @param {String} maybeStr
 */
function isString(maybeStr) {
  return Object.prototype.toString.call(maybeStr) === '[object String]';
}

/**
 * @description 判断是否是json字符串
 * @param {String} maybeJsonStr
 */
function isJsonStr(maybeJsonStr) {
  if (!isString(maybeJsonStr)) {
    return false;
  }
  try {
    return isObject(JSON.parse(maybeJsonStr));
  } catch (e) {
    return false;
  }
}

/**
 * @description 判断变量是否为数字
 * @param {Number | String} maybeNum
 * @return {Boolean} "0123"将被判定为false
 */
function isNumber(maybeNum) {
  var parsed = parseFloat(maybeNum);
  if (isNaN(parsed)) {
    return false;
  }
  return parsed.toString().length == maybeNum.toString().length;
}

/**
 * @description 验证是否是整数
 * @param {Object} maybeInt
 */
function isInt(maybeInt) {
  return /^-?\d+$/.test(parseFloat(maybeInt));
}

/**
 * @description 判断是否为函数
 * @param {Function} maybeFn
 * @return {Boolean} 为函数时返回true
 */
function isFn(maybeFn) {
  return typeof maybeFn === 'function';
}

/**
 * @description 判断是否是日期
 * @param {Date} maybeDate
 * @return {Boolean} 日期类型时返回true
 */
function isDate(maybeDate) {
  return Object.prototype.toString.call(maybeDate) === '[object Date]';
}

/**
 * @description 验证ISO类型的日期格式
 */
function isDateISO(value) {
  return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
}

/**
 * @description 是否是正则表达式
 * @param {RegExp} maybeReg
 * @return {Boolean} 正则表达式时返回true
 */
function isReg(maybeReg) {
  return Object.prototype.toString.call(maybeReg) === '[object RegExp]';
}

/**
 * @description 判断是否为邮箱
 * @param {String} maybeEmail
 */
function isEmail(maybeEmail) {
  return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(maybeEmail);
}

/**
 * @description 判断是否为手机号
 * @param {String} maybeMobile
 */
function isMobile(maybeMobile) {
  return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(maybeMobile);
}

/**
 * @description 判断是否为座机
 * @param {String} maybeLandline
 */
function isLandline(maybeLandline) {
  return /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(maybeLandline);
}

/**
 * @description 判断是否为手机号或座机号
 * @param {String} maybeTelephone
 */
function isTelephone(maybeTelephone) {
  return isMobile(maybeTelephone) || isLandline(maybeTelephone);
}

/**
 * @description 判断是否为URL
 * @param {String} maybeUrl
 */
function isUrl(maybeUrl) {
  return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(
    maybeUrl
  );
}

/**
 * @description 验证是否是xml字符串
 * @param {String} maybeXml
 */
function isXml(maybeXml) {
  const xmlReg = /^(<\?xml.*\?>)?(\r?\n)*<xml>(.|\r?\n)*<\/xml>$/i;
  return xmlReg.test(maybeXml.trim());
}

/**
 * @description 判断是否车牌号
 * @param {String} maybeCarNo
 */
function isCarNo(maybeCarNo) {
  // 旧车牌
  if (maybeCarNo.length === 7) {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/.test(
      maybeCarNo
    );
  }
  // 新能源车牌
  if (maybeCarNo.length === 8) {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/.test(
      maybeCarNo
    );
  }
  return false;
}

/**
 * @description 判断是否为最多保留2位数的金额，允许为0，不允许为负数
 * @param {Number} maybeAmount
 */
function isAmount(maybeAmount) {
  return /^[0-9]{1}[0-9]*([.]{1}[0-9]{1,2})?$/.test(maybeAmount);
}

/**
 * @description 判断是否中文
 * @param {String} value
 */
function isChinese(value) {
  let reg = /^[\u4e00-\u9fa5]+$/gi;
  return reg.test(value);
}

/**
 * @description 判断是否属于一个范围
 * @param {Number} value
 * @param {Number} min 最小值 可选参数
 * @param {Number} max 最大值 可选参数
 */
function isRange(value, min, max) {
  if (isNull(value)) {
    return false;
  }
  if (isNull(max)) {
    return value >= min;
  }
  if (isNull(min)) {
    return value <= max;
  }
  return true;
}

/**
 * @description 密码强验证：密码中必须包含大小字母、数字、特殊字符4种字符，至少8个字符，最多32个字符
 * @param {Number}  minlength 最小长度
 * @param {Number}  maxlength 最大长度
 */
function isStrongPassword(value, minlength = 8, maxlength = 32) {
  let reg = new RegExp(
    `(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{${minlength},${maxlength}}`
  );
  return reg.test(value);
}

/**
 * @description 中等强度密码验证：密码中必须包含字母、数字、特殊字符，至少8个字符，最多32个字符。
 * @param {Number}  minlength 最小长度
 * @param {Number}  maxlength 最大长度
 */
function isMediumPassword(value, minlength = 8, maxlength = 32) {
  let reg = new RegExp(`(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{${minlength},${maxlength}}`);
  return reg.test(value);
}

/**
 * @description 弱密码强度验证：密码中必须包含字母、数字，至少6个字符，最多22个字符。
 * @param {Number}  minlength 最小长度
 * @param {Number}  maxlength 最大长度
 */
function isWeekPassword(value, minlength = 6, maxlength = 22) {
  let reg = new RegExp(`(?=.*[0-9])(?=.*[a-zA-Z]).{${minlength},${maxlength}}`);
  return reg.test(value);
}

/**
 * @description 验证包含字母、空格
 * @param {Object} value
 */
function isAlphaSpace(value) {
  return /^[a-z\s]*$/i.test(value);
}

/**
 * @description 验证包含字母、数字
 * @param {Object} value
 */
function isAlphanumeric(value) {
  return /^[a-z0-9]+$/i.test(value);
}

/**
 * @description 验证包含字母、数字和空格
 */
function isAlphanumericSpace(value) {
  return /^[a-z0-9\s]*$/i.test(value);
}

/**
 * @description 验证包含小数
 * @param {Object} value
 */
function isDecimal(value) {
  return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test(value);
}

/**
 * @description 验证包含负小数
 * @param {Object} value
 */
function isNegativeDecimal(value) {
  return /^\-?(?:0|[1-9]\d*)\.\d+$/.test(value);
}

/**
 * @description 验证包含正小数
 * @param {Object} value
 */
function isPositiveDecimal(value) {
  return /^\+?(?:0|[1-9]\d*)\.\d+$/.test(value);
}

/**
 * @description 验证是否是字母
 * @param {String} value
 */
function isLetter(value) {
  return /^[a-zA-Z]*$/.test(value);
}

/**
 * @description 验证是否包含 字母或者数字
 * @param {String} value
 */
function isLetterOrNum(value) {
  let reg = /^[0-9a-zA-Z]*$/g;
  return reg.test(value);
}

/**
 * 是否promise对象
 * @param {Object} value
 */
function isPromise(value) {
  return isObject(value) && isFn(value.then) && isFn(value.catch);
}

/** 是否图片格式
 * @param {Object} value
 */
function isImage(value) {
  // 由于有很多图片链接并不是.jpg等结尾，而是带有很多get参数，故不能采用判断扩展名的形式，只能简单的判断是否为http开头
  const newValue = value.split('?')[0];
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
  return IMAGE_REGEXP.test(newValue);
}

/**
 * 是否视频格式
 * @param {Object} value
 */
function isVideo(value) {
  const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
  return VIDEO_REGEXP.test(value);
}

/**
 * 校验必须同时包含某些字符串
 * @param {String} input
 * @param {Object} conditions:里面有多个属性，如下：
 *
 * @param {String} matcherFlag 匹配标识
 * 0:数字；1：字母；2：小写字母；3:大写字母；4：特殊字符,指英文状态下的标点符号及括号等；5:中文;
 * 6:数字和字母；7：数字和小写字母；8：数字和大写字母；9：数字、字母和特殊字符；10：数字和中文；
 * 11：小写字母和特殊字符；12：大写字母和特殊字符；13：字母和特殊字符；14：小写字母和中文；15：大写字母和中文；
 * 16：字母和中文；17：特殊字符、和中文；18：特殊字符、字母和中文；19：特殊字符、小写字母和中文；20：特殊字符、大写字母和中文；
 * 100：所有字符;
 * @param {Array} excludeStrArr 排除的字符串，数组格式
 * @param {String} length 长度，可为空。1,2表示长度1到2之间；10，表示10个以上字符；5表示长度为5
 * @param {Boolean} ignoreCase 是否忽略大小写
 * conditions={matcherFlag:"0",containStrArr:[],length:"",ignoreCase:true}
 *
 */
function isPatternMustContainSomeStr(input, conditions) {
  //参数
  var matcherFlag = conditions.matcherFlag;
  var containStrArr = conditions.containStrArr;
  var length = conditions.length;
  var ignoreCase = conditions.ignoreCase;
  //创建正则
  var size = containStrArr.length;
  var regex = '^';
  var subPattern = '';
  for (var i = 0; i < size; i++) {
    containStrArr[i] = this.escapeMetacharacterOfStr(containStrArr[i]);
    subPattern += '(?=.*' + containStrArr[i] + ')';
  }
  regex += subPattern;
  switch (matcherFlag) {
    case '0':
      regex += '\\d';
      break;
    case '1':
      regex += '[a-zA-Z]';
      break;
    case '2':
      regex += '[a-z]';
      break;
    case '3':
      regex += '[A-Z]';
      break;
    case '4':
      regex += '[!-/:-@\[-`{-~]';
      break;
    case '5':
      regex += '[\u4E00-\u9FA5]';
      break;
    case '6':
      regex += '[a-zA-Z0-9]';
      break;
    case '7':
      regex += '[a-z0-9]';
      break;
    case '8':
      regex += '[A-Z0-9]';
      break;
    case '9':
      regex += '[!-~]';
      break;
    case '10':
      regex += '[0-9\u4E00-\u9FA5]';
      break;
    case '11':
      regex += '[a-z!-/:-@\[-`{-~]';
      break;
    case '12':
      regex += '[A-Z!-/:-@\[-`{-~]';
      break;
    case '13':
      regex += '[a-zA-Z!-/:-@\[-`{-~]';
      break;
    case '14':
      regex += '[a-z\u4E00-\u9FA5]';
      break;
    case '15':
      regex += '[A-Z\u4E00-\u9FA5]';
      break;
    case '16':
      regex += '[a-zA-Z\u4E00-\u9FA5]';
      break;
    case '17':
      regex += '[\u4E00-\u9FA5!-/:-@\[-`{-~]';
      break;
    case '18':
      regex += '[\u4E00-\u9FA5!-~]';
      break;
    case '19':
      regex += '[a-z\u4E00-\u9FA5!-/:-@\[-`{-~]';
      break;
    case '20':
      regex += '[A-Z\u4E00-\u9FA5!-/:-@\[-`{-~]';
      break;
    case '100':
      regex += '[\s\S]';
      break;
    default:
      alert(matcherFlag + ':This type is not supported!');
  }
  regex += this.empty(length) ? '{' + length + '}' : '+';
  regex += '$';
  var pattern = new RegExp(regex, ignoreCase ? 'i' : '');
  return pattern.test(input);
}
