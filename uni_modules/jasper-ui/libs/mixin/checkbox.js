
/**
 * @description checkbox 操作 包含方法：反选、单个
 * @param {Boolean} checked 选中状态 默认 false
 * @param {Boolean} editing 编辑状态 默认 false    
 */
export default {
	props: {},
	data() {
		return {
			checked: false,
			editing: false,
			checkboxSize: 20 //checkbox的整体大小
		};
	},
	created() {},
	computed:{
		checkBoxBtnText(){
			return this.checked ? '取消全选' : '全选';
		},
		activeColor(){
			return uni.$unc.theme['$jasper-primary']; // checkbox激活时的颜色 
		}
	},
	methods: {
		/**
		 * 单击单个checkbox
		 * @param {Object} item  操作元素
		 * @param {number} index 元素下标
		 * @param {string} url 	 跳转url
		 */
		choose(item, index, url) {
			if (this.editing) {
				this.$set(item, 'checked', !item.checked);
				return;
			}
			//跳转明细页
			uni.navigateTo({
				url
			})
		},
		/**
		 * @description 全选/取消
		 * @param {Object} checked 状态
		 * @param {Object} data    当组件checkbox数据列表
		 */
		onChange(checked, data) {
			if(!uni.$unc.isArray(data) || data.length === 0) return;
			var items = data;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i]
				this.$set(item, 'checked', checked);
			}
			this.checked = checked;
		},
		/**
		 * @description 切换管理按钮时 自动清空已经选中的checkbox值
		 */
		changeEdit(data){
			this.editing = !this.editing;
			this.editing ? this.onChange(false, data) : '';
		},
		reset(){
			this.checked = false;
			this.editing = false;
		},
		/**
		 * @description 点击管理/取消
		 */
		toEdit(list){
			this.changeEdit(list);
		},
		/**
		 * @description 是否允许删除
		 * @param {Array} list 定义于主组件中   查找列表中checked属性为true的元素
		 */
		permitDel(list){
			if(!uni.$unc.isArray(list)) return false;
			return list.some(item => item.checked);
		}
	}
}
