import touchMixin from "../../mixin/touch.js"
export default {
	mixins: [touchMixin],
	created() {
		this.preventDefault = false;  //不阻止默认行为
		this.stopPropagation = false; //允许冒泡事件
	},
	data(){
		return {
			direction: '',
			rd: null,
		}
	},
	methods: {
		/**
		 * 接受 混入组件[touchMixin]->touchstart和touchend 事件分发结果
		 * @param {Object} slideAction
		 */
		touchAction(slideAction){
			this.direction = slideAction.direction
		},
		/**
		 * 接受 混入组件[touchMixin] -> touchmove 事件分发结果
		 * @param {Object} slideAction
		 */
		touchActionMove({e, slideAction}){
			this.direction = slideAction.direction;
			if(this.direction == 'slideRight' && this.rd.current === 0){
				// 第一项静止向右滑动
				e.stopPropagation();
			}
			if(this.direction == 'slideLeft' && this.rd.current === this.rd.lastIndex){
				// 最后一项静止向左滑动
				e.stopPropagation();
			}
			return e;
		},
		propObserver(newValue, oldValue, ownerInstance, instance) {
			//注意： 必须要有这个方法 否则 无法观察更新数据
			this.direction = '';
			this.rd = newValue;
			this.resistance(this.rd.resistance.diff ?? 0, this.rd.resistance.degree ?? 0); //设置抗阻力值
		}
	}
}