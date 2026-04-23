/**
 * @description 防止遮罩层 滚动穿透  禁止蒙版后面的页面滑动效果
 */
export default {
	data() {
		return {
			preventScroll: false,
			preventScrollStyle: ''
		}
	},
	watch:{
		preventScroll(newVal){
			this.preventScrollStyle = newVal ? 
			"position: fixed; width: 100%; height: 100%; top: 0; left: 0; overflow: hidden !important" : ''
		}
	}
}
