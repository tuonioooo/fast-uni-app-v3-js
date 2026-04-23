var vertDifference = 30 // 垂直判断阈值
var horiDifference = 30 // 水平判断阈值
var vertDegree = 45 // 垂直容差角度值
var horiDegree = 45 // 水平容差角度值
var timeThreshold = 1000 // 手指停留时间阈值（ms）

var vertToleranceDeg = Math.tan(vertDegree); // 垂直容差角度判断阈值
var horiToleranceDeg = Math.tan(horiDegree); // 水平容差角度判断阈值


/**
 * @description 触摸的公共组件 阈值越小 触发的频率越高
 * @property {Number} startTime 按下时间
 * @property {Number} startX (按下的/开始时的) X坐標
 * @property {Number} startY (按下的/开始时的) Y坐標
 * @property {Number} lastX (松开的/結束时的)  X坐標
 * @property {Number} lastY (松开的/結束时的)  Y坐標
 */

export default {
	props: {
		vertDeg: {
			type: Number,
			default: 45
		},
		horiDeg: {
			type: Number,
			default: 45
		},
		vertDif: {
			type: Number,
			default: 30
		},
		horiDif: {
			type: Number,
			default: 30
		},
		timeThreshold: {
			type: Number,
			default: 1000
		}
	},
	data() {
		return {
			startTime: 0,
			startX: 0,
			startY: 0,
			lastX: 0,
			lastY: 0,
			differential: 0,
			//触摸状态
			touching: false,
			//默认开启 默认不阻止默认行为
			preventDefault: false,
			//阻止滑动 默认允许冒泡事件
			stopPropagation: false,
		};
	},
	created() {
		vertDegree = this.vertDeg;
		horiDegree = this.horiDeg;
		vertDifference = this.vertDif;
		horiDifference = this.horiDif;
		timeThreshold = this.timeThreshold;
		this.differential = 0;
	},
	methods: {
		ontouchStart(e) {
			if (this.preventDefault) {
				e.preventDefault();
			}
			//防止多次触发
			if (this.touching) {
				return;
			}
			this.startTime = Date.now()
			const touch = e.changedTouches[0]
			this.startX = touch.clientX
			this.startY = touch.clientY
			this.touching = true;
			this.$emit('touchStart', e);
			// 混入mixins方式下 调用方法  先判断函数是否存在
			if (isExitsFunction(this.touchStart)) this.touchStart(e);
		},
		ontouchMove(e) {
			if (this.preventDefault) {
				e.preventDefault();
			}
			if(this.stopPropagation){
				e.stopPropagation();
			}
			//获取滑动行为对象
			let slideAction = this.getSlideAction(e, 'touchmove');
			if (!slideAction) {
				console.log(`无法获取滑动行为，由于timeThreshold阈值（默认值）<手指按压时间过长`,);
			}
			//分发Move（动态移动）事件 供业务方法调用
			this.publishEventMove(e, slideAction);
		},
		ontouchEnd(e) {
			if (this.preventDefault) {
				e.preventDefault();
			}
			//获取滑动行为对象
			let slideAction = this.getSlideAction(e, 'touchend');
			if (!slideAction) {
				console.log(`无法获取滑动行为，由于timeThreshold阈值（默认值）<手指按压时间过长`,);
			}
			;
			//分发end事件 供业务方法调用
			this.publishEvent(slideAction);
		},
		ontouchCancel(e) {
			if (this.preventDefault) {
				e.preventDefault();
			}
			//获取滑动行为对象
			let slideAction = this.getSlideAction(e, 'touchcancel');
			if (!slideAction) {
				console.log(`无法获取滑动行为，由于timeThreshold阈值（默认值）<手指按压时间过长`,);
			}
			;
			//分发end事件 供业务方法调用
			this.publishEvent(slideAction);
		},
		/**
		 * @description 获取滑动行为对象
		 * @param {Object} e
		 */
		getSlideAction(e, event) {
			const endTime = Date.now();
			const touch = e.changedTouches[0]
			this.lastX = touch.clientX
			this.lastY = touch.clientY

			//判断手指的停留时间是否小于阈值   超过阈值（默认1秒） 则不触发
			let stayTime = endTime - this.startTime;
			//console.log(stayTime, this.startTime, "-----stayTime-------", timeThreshold, stayTime > timeThreshold);
			if (stayTime > timeThreshold) {
				this.touching = false;
				return;
			}

			//定义手势滑动行为对象 供父组件调用
			let action = {
				point: {
					startX: this.startX,  // 起始X坐标
					startY: this.startY,  // 起始Y坐标
					lastX: this.lastX,   // (终止/当前移动位置)X坐标
					lastY: this.lastY,   // (终止/当前移动所在位置)Y坐标
				},
				difference: {
					differenceAbsX: Math.abs(this.startX - this.lastX), // X轴绝对坐标差
					differenceAbsY: Math.abs(this.startY - this.lastY), // Y轴绝对坐标差
					differenceX: this.startX - this.lastX, // X轴坐标差
					differenceY: this.startY - this.lastY  // Y轴坐标差
				},
				stayTime,  //停留时间
				direction: '',// 滑动的方向
				event, //当前滑动触发事件 touchmove、touchend
			};


			// 判断滑动距离比是否小于垂直容差角度值
			if (Math.abs((this.lastX - this.startX) / (this.lastY - this.startY)) < vertToleranceDeg) {
				// 上滑事件，判断垂直滑动距离是否大于垂直判断阈值
				if (Math.abs(this.startY - this.lastY) >= vertDifference && this.startY - this.lastY > 0) {
					action['direction'] = 'slideUp';
				}

				// 下滑事件，判断垂直滑动距离是否大于垂直判断阈值
				else if (Math.abs(this.startY - this.lastY) >= vertDifference && this.startY - this.lastY < 0) {
					action['direction'] = 'slideDown';
				}
			}

			// 判断滑动距离比是否小于水平容差角度值
			else if (Math.abs((this.lastY - this.startY) / (this.lastX - this.startX)) < horiToleranceDeg) {
				// 左滑事件，判断水平滑动距离是否大于垂直判断阈值
				if (Math.abs(this.startX - this.lastX) >= vertDifference && this.startX - this.lastX > 0) {
					action['direction'] = 'slideLeft';
				}
				// 右滑事件，判断水平滑动距离是否大于垂直判断阈值
				else if (Math.abs(this.startX - this.lastX) >= vertDifference && this.startX - this.lastX < 0) {
					action['direction'] = 'slideRight';
				}
			}

			return action;
		},


		/**
		 * @description 分发事件 供业务方法调用
		 * @param {String} slideAction 滑动行为对象，包含四个方向：slideUp、slideDown、slideLeft、slideRight
		 */
		publishEvent(slideAction) {
			switch (slideAction.direction) {
				case 'slideUp':
					//向父组件上滑监听事件传值  没定义的话 忽略
					this.$emit('slideUp', slideAction);
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideUp)) this.slideUp(slideAction);
				case 'slideDown':
					//向父组件下滑监听事件传值  没定义的话 忽略
					this.$emit('slideDown', slideAction);
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideDown)) this.slideDown(slideAction);
				case 'slideLeft':
					//向父组件左滑监听事件传值  没定义的话 忽略
					this.$emit('slideLeft', slideAction);
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideLeft)) this.slideLeft(slideAction);
				case 'slideRight':
					//向父组件右滑监听事件传值  没定义的话 忽略
					this.$emit('slideRight', slideAction);
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideRight)) this.slideRight(slideAction);
				default:
					slideAction.event === 'touchend' ? this.touching = false : '';

					// 向父组件监听事件中传值  没定义的话 忽略
					this.$emit('touchAction', {
						...slideAction
					})
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.touchAction)) this.touchAction(slideAction);
					this.startTime = new Date();
					this.touching = false;
					break;
			}

		},

		/**
		 * @description 分发Move事件 供业务方法调用
		 * @param {String} slideAction 滑动行为对象，包含四个方向：slideUp、slideDown、slideLeft、slideRight
		 */
		publishEventMove(e, slideAction) {
			switch (slideAction.direction) {
				case 'slideUp':
					//向父组件上滑监听事件传值  没定义的话 忽略
					this.$emit('slideUpMove', {e, slideAction});
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideUpMove)) this.slideUpMove({e, slideAction});
				case 'slideDown':
					//向父组件下滑监听事件传值  没定义的话 忽略
					this.$emit('slideDownMove', {e, slideAction});
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideDownMove)) this.slideDownMove({e, slideAction});
				case 'slideLeft':
					//向父组件左滑监听事件传值  没定义的话 忽略
					this.$emit('slideLeftMove', {e, slideAction});
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideLeftMove)) this.slideLeftMove({e, slideAction});
				case 'slideRight':
					//向父组件右滑监听事件传值  没定义的话 忽略
					this.$emit('slideRightMove', {e, slideAction});
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.slideRightMove)) this.slideRightMove({e, slideAction});
				default:
					// 向父组件监听事件中传值  没定义的话 忽略
					this.$emit('touchActionMove', {
						e,
						...slideAction
					})
					// 混入mixins方式下 调用方法  先判断函数是否存在
					if (isExitsFunction(this.touchActionMove)) this.touchActionMove({e, slideAction});
					this.startTime = new Date();
					this.touching = false;
					break;
			}

		},

		/**
		 * @description    设置滑动阻力抗拒值
		 * @param diff        水平、垂直平面阻力抗拒值
		 * @param degree    水平、垂直角度阻力抗拒值
		 * @param timeThreshold 手指停留的世界
		 */
		resistance(diff = 0, degree = 0, timeThreshold = 5000) {
			this.setTimeThreshold(timeThreshold)
			this.setVertDifference(diff);
			this.setHoriDifference(diff);
			this.setVertDegree(degree);
			this.setHoriDegree(degree);
		},

		/**
		 * ==================向父组件中提供修改容错值的方法==================
		 *
		 */
		setTimeThreshold(_threshold) {
			timeThreshold = _threshold;
		},
		setVertDifference(_vertDifference) {
			vertDifference = _vertDifference;
		},
		setHoriDifference(_horiDifference) {
			horiDifference = _horiDifference;
		},
		setVertDegree(_vertDegree) {
			vertDegree = _vertDegree;
		},
		setHoriDegree(_horiDegree) {
			horiDegree = _horiDegree;
		}
	}
};

/**
 * @description 混入mixins方式 会调用该函数  判断当前函数是否存在
 * @注意：避免 使用函数eval, 使用 this 来获取当前上下文的函数 , 在uni-app 编译过程中 报错： "Using direct eval with a bundler is not recommended and may cause problems [direct-eval]"
 * @param {Object} func eg: 混入Vue 中 isExitsFunction(this.touchAction)
 *
 */
function isExitsFunction(func) {
	try {
		// 方法一、使用eval()
		// if (typeof (eval(funcName)) == "function") {
		//     return true;
		// }
		// 方法二、typeof func === 'function';
		// 使用 this 来获取当前上下文的函数  避免 使用函数eval, 在uni-app 编译过程中 报错： "Using direct eval with a bundler is not recommended and may cause problems [direct-eval]"
		return typeof func === 'function';
	} catch (e) {
	}
	return false;

}