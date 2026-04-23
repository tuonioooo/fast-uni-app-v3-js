### swiper-resistance 组件说明

swiper-resistance 主要是用来解决uni-app 官方swiper组件 左右滑动首项和最后一项 阻力抗拒的情况。

#### 抗拒力值设置  方法一（仅适用 APP-PLUS || H5 平台 ），通过`transition`事件, 与slideEl元素动态设置style来实现

* `swiper-resistance.js`

```js
var slideEl = null;
import touchMixin from "@/uni_modules/jasper-ui/libs/mixin/touch.js"
export default {
	mixins: [touchMixin],
	mounted() {
		slideEl = document.getElementsByClassName("uni-swiper-slide-frame")[0];
	},
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
		},
		/**
		 * @description swiper动态滑动时处理
		 * 注意：兼容Vu3版本 e.target.dx 获取不到值了, 改成e.detail.dx , Vue2没有问题
		 * @param {Object} e
		 */
		transition(e) {
			//第一项 抗拒禁止滑动
			if (
				(e.detail.dx <= 0 && this.rd.current === 0 )
				||
				(e.detail.dx >= 0 && this.rd.current === 0 && this.direction == 'slideRight')
			) {
				slideEl.style = 'transform: translate(0%, 0px) translateZ(0px) !important';
				//console.log(this.rd.current,  this.direction, e.detail.dx, "======transition=====");
			}

			//最后一项抗拒禁止滑动
			if (
				(e.detail.dx >= 0 && this.rd.current === this.rd.lastIndex)
				||
				(e.detail.dx <= 0 && this.rd.current === this.rd.lastIndex && this.direction == 'slideLeft')
			){
				let translateX = -100 * this.rd.lastIndex;
				slideEl.style = `transform: translate(${translateX}%, 0px) translateZ(0px) !important`;
				//console.log(this.rd.current,  this.direction, "======transition=====");
			}
		},
		propObserver(newValue, oldValue, ownerInstance, instance) {
			//注意： 必须要有这个方法 否则 无法观察更新数据
			this.direction = '';
			this.rd = newValue;
			this.resistance(this.rd.resistance.diff, this.rd.resistance.degree); //设置抗阻力值
		}
	}
}
```

> 备注：
> 1）swiper 组件标签上不支持 touchmove，主要是官方内部组件使用了，所以我们只能注册到swiper-item标签上  
> 2）renderjs同时监控change、animationfinish、transition事件，用于保持renderData中索引能实时的同步到视图层，最终来处理左右抗拒滑动的问题。
> 3) swiper duration设置的问题 如果swiper 滑块为2 采用默认的500毫秒即可，如果滑块为3 采用的是300毫秒 避免问题出现


* 示例

```vue
<!--逻辑层  -->
<template>
  <view class="container">
    <!-- you coding  -->
    <swiper :current="current" ref="swiperRef" class="swiper-box" :duration="200"
            id="ss"
            @change="ontabchange"
            @animationfinish="animationfinish"
            @transition="swiperModule.transition"
            :prop="renderData"
            :change:prop="swiperModule.propObserver"
            @touchstart="swiperModule.ontouchStart"
            @touchend="swiperModule.ontouchEnd">
      <swiper-item class="swiper-item scroll-v" v-for="(tab, bIndex) in count" :key="bIndex"
                   @touchmove="swiperModule.ontouchMove">
        <view style="display: flex; justify-content: center; align-items: center; height: 100%">
          页面{{tab}}
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        current: 0, // 预设当前项的值
        count: 2,   // 假设共2个swiper-item
      }
    },
    computed: {
      renderData() {
        return {
          current: this.current,
          lastIndex: this.count - 1 , // 假设共2个swiper-item,索引是从0开始的
          resistance: { // 抗拒力值设置
            diff: 0,    // 水平
            degree: 0,  // 垂直
            timeThreshold: 5000, // 手指停留时间
          }
        }
      }
    },
    methods: {
      ontabchange(e) {
        let current = e.target.current || e.detail.current;
        this.switchTab(current);
      },
      animationfinish(e) {
        let current = e.target.current || e.detail.current;
        this.current = current;
      },
      switchTab(index) {
        this.current = index;
      },
    }
  }
</script>

<!--视图层  -->
<!-- #ifdef APP-PLUS || H5 -->
<script module="swiperModule" lang="renderjs">
  //Vue3 renderjs引入时，需要相对路径, Vue2无任何问题, 微信小程序暂时不支持
  //@see https://ask.dcloud.net.cn/question/191765
  export {
    default
  }
  from "../../uni_modules/jasper-ui/libs/function/resistance/swiper-resistance.js";
</script>
<!-- #endif -->
<style lang="scss" scoped>
  @import '@/uni_modules/jasper-ui/css/demand/uni-swiper.scss';
  @import '@/uni_modules/jasper-ui/css/demand/uni-scroll-view-tab.scss';

  .container {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 100vh;
    background-color: #FFFFFF;
  }

  .scroll-h {
    width: 750rpx;
    /* #ifdef H5 */
    width: 100%;
    /* #endif */
    height: 80rpx;
    flex-direction: row;
    /* #ifndef APP-PLUS */
    white-space: nowrap;
    /* #endif */
    justify-content: center;
    align-items: center;
    text-align: center;
  }

</style>
```


#### 抗拒力值设置 (推荐此方法) 方法二（仅适用 APP-PLUS || H5 平台 ），通过`touchmove`分发事件 `touchActionMove`, 结合 `e.stopPropagation()` 阻止事件冒泡，达到目的。

* `swiper-resistance.js`

```js
import touchMixin from "./touch.js"

export default {
    mixins: [touchMixin],
    created() {
        this.preventDefault = false;  //不阻止默认行为
        this.stopPropagation = false; //允许冒泡事件
    },
    data() {
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
        touchAction(slideAction) {
            this.direction = slideAction.direction
        },
        /**
         * 接受 混入组件[touchMixin] -> touchmove 事件分发结果
         * @param {Object} slideAction
         */
        touchActionMove({e, slideAction}) {
            this.direction = slideAction.direction;
            if (this.direction == 'slideRight' && this.rd.current === 0) {
                // 第一项静止向右滑动
                e.stopPropagation();
            }
            if (this.direction == 'slideLeft' && this.rd.current === this.rd.lastIndex) {
                // 最后一项静止向左滑动
                e.stopPropagation();
            }
            return e;
        },
        propObserver(newValue, oldValue, ownerInstance, instance) {
            //注意： 必须要有这个方法 否则 无法观察更新数据
            this.direction = '';
            this.rd = newValue;
            this.resistance(this.rd.resistance.diff, this.rd.resistance.degree); //设置抗阻力值
        }
    }
}
```

* 示例

```vue
<!--逻辑层  -->
<template>
  <view class="container">
    <!-- you coding  -->
    <swiper :current="current" ref="swiperRef" class="swiper-box" :duration="200"
            id="ss"
            @change="ontabchange"
            @animationfinish="animationfinish"
            :prop="renderData"
            :change:prop="swiperModule.propObserver"
            @touchstart="swiperModule.ontouchStart"
            @touchend="swiperModule.ontouchEnd">
      <swiper-item class="swiper-item scroll-v" v-for="(tab, bIndex) in count" :key="bIndex"
                   @touchmove="swiperModule.ontouchMove">
        <view style="display: flex; justify-content: center; align-items: center; height: 100%">
          页面{{tab}}
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: 0, // 预设当前项的值
      count: 2,   // 假设共2个swiper-item
    }
  },
  computed: {
    renderData() {
      return {
        current: this.current,
        lastIndex: this.count - 1 , // 假设共2个swiper-item,索引是从0开始的
        resistance: { // 抗拒力值设置
          diff: 0,    // 水平
          degree: 0,  // 垂直
          timeThreshold: 5000, // 手指停留时间
        }
      }
    }
  },
  methods: {
    ontabchange(e) {
      let current = e.target.current || e.detail.current;
      this.switchTab(current);
    },
    animationfinish(e) {
      let current = e.target.current || e.detail.current;
      this.current = current;
    },
    switchTab(index) {
      this.current = index;
    },
  }
}
</script>

<!-- 视图层 -->
<!-- #ifdef APP-PLUS || H5 -->
<script module="swiperModule" lang="renderjs">
//Vue3 renderjs引入时，需要相对路径, Vue2无任何问题, 微信小程序暂时不支持
//@see https://ask.dcloud.net.cn/question/191765
export {
  default
}
from "../../uni_modules/jasper-ui/libs/function/resistance/swiper-resistance.js";
</script>
<!-- #endif -->
<style lang="scss" scoped>
@import '@/uni_modules/jasper-ui/css/demand/uni-swiper.scss';
@import '@/uni_modules/jasper-ui/css/demand/uni-scroll-view-tab.scss';

.container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100vh;
  background-color: #FFFFFF;
}

.scroll-h {
  width: 750rpx;
  /* #ifdef H5 */
  width: 100%;
  /* #endif */
  height: 80rpx;
  flex-direction: row;
  /* #ifndef APP-PLUS */
  white-space: nowrap;
  /* #endif */
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
```

### swiper-resistance.wxs 组件说明

swiper-resistance.wxs 主要是应对于小程序端抗阻力值的设置

```js
var vertDifference = 30; // 垂直判断阈值
var horiDifference = 30; // 水平判断阈值
var vertDegree = 45; // 垂直容差角度值
var horiDegree = 45; // 水平容差角度值
var timeThreshold = 1000; // 手指停留时间阈值（ms）

var vertToleranceDeg = Math.tan(vertDegree); // 垂直容差角度判断阈值
var horiToleranceDeg = Math.tan(horiDegree); // 水平容差角度判断阈值


var startTime = 0, startX = 0, startY = 0, lastX = 0, lastY = 0, touching = false;
// 绑定逻辑层的数据
var wxsData = {}

/**
 * 注意：
 *
 * 1.建议用函数形式声明来访问全局变量，如果： function xxx(a){}
 * 2.函数声明方式：var xx = function(a){} 这种形式访问全局变量 会有问题
 *
 * @param e
 */
function ontouchStart(e) {
    var touch = e.touches[0] || e.changedTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    touching = true;
}

function ontouchMove(e) {
    //获取滑动行为对象
    var slideAction = getSlideAction(e, 'touchmove');
    if (!slideAction) {
        console.log('无法获取滑动行为，由于timeThreshold阈值（默认值）<手指按压时间过长');
        return false; // 仅用于结构，防止默认行为
    }
    var direction = slideAction.direction;
    if(direction == 'slideRight' && wxsData.current === 0){
        // 第一项静止向右滑动
        return false;
    }
    if(direction == 'slideLeft' && wxsData.current === wxsData.lastIndex){
        // 最后一项静止向左滑动
        return false;
    }
    return slideAction;
}

function ontouchEnd(e) {
    var touch = e.touches[0] || e.changedTouches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
    var endTime = Date.now();
    var stayTime = endTime - startTime;

    if (stayTime > timeThreshold) {
        touching = false;
        return;
    }

    var action = getSlideAction(e, 'touchend');
    return action; // 返回滑动动作对象
}

function getSlideAction(e, eventName) {
    var endTime = Date.now();
    var touch = e.touches[0] || e.changedTouches[0]

    lastX = touch.clientX
    lastY = touch.clientY
    //判断手指的停留时间是否小于阈值   超过阈值（默认1秒） 则不触发
    var stayTime = endTime - startTime;
    //console.log(stayTime, startTime, "-----stayTime-------", timeThreshold, stayTime > timeThreshold);
    if (stayTime > timeThreshold) {

        touching = false;
        return;
    }

    //定义手势滑动行为对象 供父组件调用
    var action = {
        point: {
            startX: startX,  // 起始X坐标
            startY: startY,  // 起始Y坐标
            lastX: lastX,   // (终止/当前移动位置)X坐标
            lastY: lastY   // (终止/当前移动所在位置)Y坐标
        },
        difference: {
            differenceAbsX: Math.abs(startX - lastX), // X轴绝对坐标差
            differenceAbsY: Math.abs(startY - lastY), // Y轴绝对坐标差
            differenceX: startX - lastX, // X轴坐标差
            differenceY: startY - lastY  // Y轴坐标差
        },
        stayTime: stayTime,  //停留时间
        direction: '',// 滑动的方向
        event: eventName //当前滑动触发事件名称 touchmove、touchend
    };

    // 判断滑动距离比是否小于垂直容差角度值
    if (Math.abs((lastX - startX) / (lastY - startY)) < vertToleranceDeg) {
        // 上滑事件，判断垂直滑动距离是否大于垂直判断阈值
        if (Math.abs(startY - lastY) >= vertDifference && startY - lastY > 0) {
            action['direction'] = 'slideUp';
        }

        // 下滑事件，判断垂直滑动距离是否大于垂直判断阈值
        else if (Math.abs(startY - lastY) >= vertDifference && startY - lastY < 0) {
            action['direction'] = 'slideDown';
        }
    }

    // 判断滑动距离比是否小于水平容差角度值
    else if (Math.abs((lastY - startY) / (lastX - startX)) < horiToleranceDeg) {
        // 左滑事件，判断水平滑动距离是否大于水平判断阈值
        if (Math.abs(startX - lastX) >= horiDifference && startX - lastX > 0) {
            action['direction'] = 'slideLeft';
        }
        // 右滑事件，判断水平滑动距离是否大于垂直判断阈值
        else if (Math.abs(startX - lastX) >= horiDifference && startX - lastX < 0) {
            action['direction'] = 'slideRight';
        }
    }

    return action;
}

/**
 * @description    监听父组件传递过来的数据
 * @param wxsProp
 */
function propObserver(wxsProp) {
    if(!wxsProp) return
    wxsData = wxsProp;
    console.log('[swiper-resistance.wxs]-wsData=' + JSON.stringify( wxsData))
    resistance(wxsData.resistance)
}

/**
 * @description    设置滑动阻力抗拒值
 * @param resistance
 */
function resistance(resistance) {
    horiDifference = resistance.diff; // 水平
    horiDegree = resistance.degree;
    vertDifference = resistance.diff; // 垂直
    vertDegree = resistance.degree;
    timeThreshold = resistance.timeThreshold; //手指停留时间
}

module.exports = {
    ontouchStart: ontouchStart,
    ontouchMove: ontouchMove,
    ontouchEnd: ontouchEnd,
    propObserver:propObserver
};
```

示例

```vue
<template>
  <view class="container">
    <!-- you coding  -->
    <swiper :current="current" ref="swiperRef" class="swiper-box" :duration="200"
            id="ss"
            @change="ontabchange"
            @animationfinish="animationfinish"
            :prop="renderData"
            :change:prop="swiperModule.propObserver"
            @touchstart="swiperModule.ontouchStart"
            @touchend="swiperModule.ontouchEnd">
      <swiper-item class="swiper-item scroll-v" v-for="(tab, bIndex) in count" :key="bIndex"
                   @touchmove="swiperModule.ontouchMove">
        <view style="display: flex; justify-content: center; align-items: center; height: 100%">
          页面{{tab}}
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: 0, // 预设当前项的值
      count: 2,   // 假设共2个swiper-item
    }
  },
  computed: {
    renderData() {
      return {
        current: this.current,
        lastIndex: this.count - 1 , // 假设共2个swiper-item,索引是从0开始的
        resistance: { // 抗拒力值设置
          diff: 0,    // 水平
          degree: 0,  // 垂直
          timeThreshold: 5000, // 手指停留时间
        }
      }
    }
  },
  methods: {
    ontabchange(e) {
      let current = e.target.current || e.detail.current;
      this.switchTab(current);
    },
    animationfinish(e) {
      let current = e.target.current || e.detail.current;
      this.current = current;
    },
    switchTab(index) {
      this.current = index;
    },
  }
}
</script>

<!-- 视图层 -->
<!-- #ifdef MP-WEIXIN -->
<script src="/uni_modules/jasper-ui/libs/function/resistance/wxs/swiper-resistance.wxs" module="swiperModule" lang="wxs"></script>
<!-- #endif -->
<style lang="scss" scoped>
@import '@/uni_modules/jasper-ui/css/demand/uni-swiper.scss';
@import '@/uni_modules/jasper-ui/css/demand/uni-scroll-view-tab.scss';

.container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100vh;
  background-color: #FFFFFF;
}

.scroll-h {
  width: 750rpx;
  /* #ifdef H5 */
  width: 100%;
  /* #endif */
  height: 80rpx;
  flex-direction: row;
  /* #ifndef APP-PLUS */
  white-space: nowrap;
  /* #endif */
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
```