import {isNull , isNumber , isDate , isString, isObject } from "../../validate/src/type.js";


// padStart 的 polyfill，因为某些机型或情况，还无法支持es7的padStart，比如电脑版的微信小程序
// 所以这里做一个兼容polyfill的兼容处理
if (!String.prototype.padStart) {
    // 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
    String.prototype.padStart = function(maxLength, fillString = ' ') {
        if (Object.prototype.toString.call(fillString) !== "[object String]") throw new TypeError(
            'fillString must be String')
        let str = this
        // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
        if (str.length >= maxLength) return String(str)
        let fillLength = maxLength - str.length,
            times = Math.ceil(fillLength / fillString.length)
        while (times >>= 1) {
            fillString += fillString
            if (times === 1) {
                fillString += fillString
            }
        }
        return fillString.slice(0, fillLength) + str;
    }
}

/**
 * @description 日期计算  返回对应日期 加减后的日期值（过去第多少天，或者将来多少天）
 * @param {Number} diff +1 or -1 日期计算差值
 */
function calcDate(date , diff) {
    date = date || null ;
    if (isNull(date)) {
        return date ;
    }
    if (!isNumber(diff)) {
        return date ;
    }
    date.setDate(date.getDate() + diff);
    let newDate = new Date(date);
    return isNaN(newDate) ? date : newDate ;
}


/**
 * 两个日期相差数，返回负天数表示已超过指定日期，正天数表示还没到指定时间
 * @param dateBegin 开始日期
 * @param dateEnd 结束日期
 * @returns 相差的天数，小时数，分钟数，秒数
 */
function dateDiff(dateBegin, dateEnd){
    dateBegin = dateBegin.replace(/-/g, '\/'); //如 2016-1-1 格式化为 2016/1/1
    dateEnd = dateEnd.replace(/-/g, '\/');
    let date1 = new Date(dateBegin);
    let date2 = new Date(dateEnd);

    let d1 = date1.getTime();
    let d2 = date2.getTime();
    let total = 0;
    if (d1 > d2) {
        total = (d1 - d2) / 1000;
    } else {
        total = (d2 - d1) / 1000;
    }

    let day = Math.floor(Number(total / (24 * 60 * 60))); //计算整数天数
    let afterDay = Math.floor(Number(total - day * 24 * 60 * 60)); //取得算出天数后剩余的秒数
    let hour = Math.floor(Number(afterDay / (60 * 60))); //计算整数小时数
    let afterHour = Math.floor(Number(total - day * 24 * 60 * 60 - hour * 60 * 60)); //取得算出小时数后剩余的秒数
    let minute = Math.floor(Number(afterHour / 60)); //计算整数分
    let second = Math.floor(Number(total - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60)); //取得算出分后剩余的秒数

    day = d1 > d2 ? -day : day;
    return {
        total: d1 - d2,
        day: day,
        hour: hour,
        minute: minute,
        second: second
    }
}

/**
 * @description 检查日期是否过期
 * @param timeStr 时间参数
 * @return {Boolean} true or false
 */
function checkExpired(timeStr = '2023-12-31'){
    //过期时间
    var expiredDate = new Date(timeStr);
    //当前日期
    var currentDate = new Date();

    if(currentDate <= expiredDate){
        // 未过期，可以继续使用
        return true;
    } else {
        // 已过期
        return false;
    }
}
/**
 * @description 字符串转为日期
 * @param {String|Timestamp} time 转换日期的字符串或时间毫秒数
 * @param {Date} defDate	错误补充日期 默认为null 当time校验不过时，直接返回指定的日期 如不指定 直接返回null
 * @example  示例:	parseDate("2023-04-20 23:59:59")	输出: Thu Apr 20 2023 23:59:59 GMT+0800 (中国标准时间)
 */
function parseDate(time , defDate) {
    defDate = defDate || null ;
    if (isNull(time)) {
        return defDate ;
    }
    if (isDate(time)) {
        return time ;
    }
    if (isNumber(time)) {
        if (time.toString().length == 10) {
            time = time * 1000 ;
        }
        if (time.toString().length != 13) {
            console.log("time参数不合法")
            return defDate ;
        }
    }
    if (isString(time)) {
        time = Date.parse(time.replace(/(年|月|-)/g, '/').replace(/(日)/g, ''));
    }
    let date = new Date(time) ;
    return isNaN(date.getTime()) ? defDate : date ;
}


function getFormat (format) {
    switch (format){
        case 'second':
            return 'yyyy-MM-dd HH:mm:ss' ;
        case 'minute':
            return 'yyyy-MM-dd HH:mm' ;
        case 'hour':
            return 'yyyy-MM-dd HH' ;
        case 'day':
            return 'yyyy-MM-dd' ;
        case 'month':
            return 'yyyy-MM' ;
        case 'year':
            return 'yyyy' ;
        default:
            return format ;
    }
}


function toStr ( date , format ) {
    if (null == date) {
        return '' ;
    }
    format = getFormat(format);
    let ret ;
    const opt = {
        "y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(format);
        if (ret) {
            format = format.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return format ;
}

/**
 * @description 特定格式 日期格式化
 * @param {Date} date 日期
 * @param {String} fmt 特定格式 second、minute、hour、day...
 */
function format( _date , fmt ) {
    let config = {};
    if (!isObject(_date)) {
        config = {
            date : _date ,
            format : fmt
        }
    }
    let { date , format = 'minute' , defaultDate , differ = 'none' } = config ;
    date = parseDate( date , defaultDate ) ;
    return toStr(date , format) ; ;
}

/**
 * @description 大众格式 日期格式化
 * @param {Date} dateTime 日期
 * @param {String} fmt 大众格式 yyyy:MM:dd|yyyy:MM|yyyy年MM月dd日|yyyy年MM月dd日 HH时mm分等,可自定义组合
 */
function formatDate(dateTime = null, fmt = 'yyyy-MM-dd') {
    // 如果为null,则格式化当前时间
    if (!dateTime) dateTime = Number(new Date());
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString()
        .length == 10) dateTime *= 1000;
    let date = new Date(dateTime);
    let ret;
    let opt = {
        "y+": date.getFullYear()
            .toString(), // 年
        "M+": (date.getMonth() + 1)
            .toString(), // 月
        "d+": date.getDate()
            .toString(), // 日
        "H+": date.getHours()
            .toString(), // 时
        "m+": date.getMinutes()
            .toString(), // 分
        "s+": date.getSeconds()
            .toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")")
            .exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

/**
 * @description 日期格式化为印记 几分钟前、刚刚、几个月前
 * @param {Date} dateTime 日期
 * @param {String} format
 * @example formatDateToSign(new Date('2022/03/12 13:09'), false)
 */
function formatDateToSign(dateTime = null, format = 'yyyy-MM-dd') {
    // 如果为null,则格式化当前时间
    if (!dateTime) dateTime = Number(new Date());
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString()
        .length == 10) dateTime *= 1000;
    let timestamp = +new Date(Number(dateTime));
    let timer = (Number(new Date()) - timestamp) / 1000;
    // 如果小于5分钟,则返回"刚刚",其他以此类推
    let tips = '';
    switch (true) {
        case timer < 300:
            tips = '刚刚';
            break;
        case timer >= 300 && timer < 3600:
            tips = parseInt(timer / 60) + '分钟前';
            break;
        case timer >= 3600 && timer < 86400:
            tips = parseInt(timer / 3600) + '小时前';
            break;
        case timer >= 86400 && timer < 2592000:
            tips = parseInt(timer / 86400) + '天前';
            break;
        default:
            // 如果format为false，则无论什么时间戳，都显示xx之前
            if (format === false) {
                if (timer >= 2592000 && timer < 365 * 86400) {
                    tips = parseInt(timer / (86400 * 30)) + '个月前';
                } else {
                    tips = parseInt(timer / (86400 * 365)) + '年前';
                }
            } else {
                tips = formatDate(timestamp, format);
            }
    }
    return tips;
}

/**
 * @description 获取指定时间的星期几
 * @param {*} dateTime 日期
 */
function getWeek(dateTime = null){
    // 如果为null,则格式化当前时间
    if (!dateTime) dateTime = Number(new Date());
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString().length === 10) dateTime *= 1000;
    let date = new Date(dateTime);
    var day = date.getDay();
    var week;
    switch(day) {
        case 1:
            week = '星期一';
            break;
        case 2:
            week = '星期二';
            break;
        case 3:
            week = '星期三';
            break;
        case 4:
            week = '星期四';
            break;
        case 5:
            week = '星期五';
            break;
        case 6:
            week = '星期六';
            break;
        case 0:
            week = '星期日';
            break;
    }
    return week;
}

/**
 * 转换字符串为ios支持的格式字符串，注意：ios仅支持 yyyy/MM/dd 斜杠格式
 * @param {String} dateStr 日期字符串
 */
function formatIosDate(dateStr = null){
    if (!dateStr) return Number(new Date());
    dateStr = dateStr.replace(/T/g,' ').replace(/-/g,"/").indexOf('.')>-1
        ? dateStr.replace(/T/g,' ').replace(/-/g,"/").substring(0,data.replace(/T/g,' ').replace(/-/g,"/").indexOf('.'))
        : dateStr.replace(/T/g,' ').replace(/-/g,"/")
    return new Date(dateStr);
}

export {
    calcDate,
    dateDiff,
    checkExpired,
    parseDate,
    format,
    formatDate,
    formatDateToSign,
    formatIosDate,
    getWeek
} ;