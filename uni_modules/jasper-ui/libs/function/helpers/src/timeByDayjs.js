import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import locale_zh from 'dayjs/locale/zh-cn'; // 中文

dayjs.locale(locale_zh) // 全局使用 默认中文
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const timeByDayjs = {
    /**
     * 设置日期语言
     * @description 外部可以调用此方法 来设置日期语言
     * @example
     *      import 'dayjs/locale/de';              // 引入外文
     *      uni.$jasper.timeByDayjs.setLocale('de');  // 设置语言
     * @param {string | Object} locale 语言代码（如 'en', 'zh-cn'）
     */
    setLocale(locale) {
        dayjs.locale(locale);
    },
    /**
     * 获取当前语言
     * @returns {string} 当前语言代码
     */
    getLocale() {
        return dayjs.locale();
    },
    /**
     * 获取当前日期时间
     * @returns {string} 当前时间字符串
     */
    getCurrentDateTime() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
    },

    /**
     * 获取当前日期
     * @returns {string} 当前日期字符串
     */
    getCurrentDate() {
        return dayjs().format('YYYY-MM-DD');
    },

    /**
     * 将指定时间格式化为目标格式
     * @param {string|Date} date 日期对象或字符串
     * @param {string} format 目标格式
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        return dayjs(date).format(format);
    },

    /**
     * 判断某个日期是否是今天
     * @param {string|Date} date 日期对象或字符串
     * @returns {boolean} 是否是今天
     */
    isToday(date) {
        return dayjs(date).isSame(dayjs(), 'day');
    },

    /**
     * 日期差值计算
     * @param {string|Date} date1 开始日期
     * @param {string|Date} date2 结束日期
     * @param {string} unit 差值单位（'year', 'month', 'day', 'hour', 'minute', 'second'）
     * @returns {number} 差值
     */
    diff(date1, date2, unit = 'day') {
        return dayjs(date2).diff(dayjs(date1), unit);
    },

    /**
     * 将秒数转换为可读的时间格式（HH:mm:ss）
     * @param {number} seconds 秒数
     * @returns {string} 可读时间字符串
     */
    secondsToReadableTime(seconds) {
        return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
    },

    /**
     * 获取从现在起的相对时间
     * @param {string|Date} date 日期对象或字符串
     * @returns {string} 相对时间字符串
     */
    getRelativeTime(date) {
        return dayjs(date).fromNow();
    },
    /**
     * 将时间转换为 UTC 格式
     * @param {string|Date} date 日期对象或字符串
     * @returns {string} UTC 格式的时间
     */
    toUTC(date) {
        return dayjs(date).utc().format();
    },

    /**
     * 检查日期是否在指定范围内
     * @param {string|Date} date 目标日期
     * @param {string|Date} start 开始日期
     * @param {string|Date} end 结束日期
     * @returns {boolean} 是否在范围内
     */
    isBetween(date, start, end) {
        return dayjs(date).isBetween(dayjs(start), dayjs(end), null, '[]');
    },

    /**
     * 增加指定时间
     * @param {string|Date} date 日期对象或字符串
     * @param {number} amount 数量
     * @param {string} unit 单位（'year', 'month', 'day', 'hour', 'minute', 'second'）
     * @returns {string} 增加时间后的日期字符串
     */
    add(date, amount, unit = 'day') {
        return dayjs(date).add(amount, unit).format('YYYY-MM-DD HH:mm:ss');
    },

    /**
     * 减少指定时间
     * @param {string|Date} date 日期对象或字符串
     * @param {number} amount 数量
     * @param {string} unit 单位（'year', 'month', 'day', 'hour', 'minute', 'second'）
     * @returns {string} 减少时间后的日期字符串
     */
    subtract(date, amount, unit = 'day') {
        return dayjs(date).subtract(amount, unit).format('YYYY-MM-DD HH:mm:ss');
    },
};

export default timeByDayjs;
