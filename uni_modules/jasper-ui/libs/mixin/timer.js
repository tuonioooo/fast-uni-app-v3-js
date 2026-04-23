/**
 * @description 时间签名(显示几秒前、刚刚等词汇)、时间格式化混入组件
 */
export default {
	methods: {
		//时间签名(显示几秒前、刚刚等词汇)
		showTime(dateStr) {
			if (!dateStr) return '';
			let platform = uni.$miliqk.getSystemInfoSync().platform;
			let dateTime = '';
			if (platform === 'ios') {
				dateTime = uni.$miliqk.formatIosDate(dateStr);
			} else {
				dateTime = new Date(dateStr);
			}
			return uni.$miliqk.formatDateToSign(dateTime, false);
		},
		//将日期定位到秒的字符串 转换成 yyyy-MM-dd 格式字符串
		showDateStr(dateStr){
			if (!dateStr) return '';
			let platform = uni.$miliqk.getSystemInfoSync().platform;
			let date = '';
			if (platform === 'ios') {
				date = uni.$miliqk.formatIosDate(dateStr);
			} else {
				date = new Date(dateStr);
			}
			return uni.$miliqk.formatDate(date, 'yyyy-MM-dd');
		}
	}
}