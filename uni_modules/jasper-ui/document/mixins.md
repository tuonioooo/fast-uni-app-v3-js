# jasper-ui 组件中 mixins 的使用示例教程


#### commonStorage.js

* 场景：设置缓存key的过期时间
* 用途：按需引入

#### download.js

* 场景：公共下载文件的混入组件
* 用途：按需引入
* 示例：

```typescript
import downloadMixin from "@/uni_modules/jasper-ui/libs/mixin/download.js"
export default {
    mixins: [downloadMixin],
    data(){
        return {}
    }
    //todo
}
	
//任务触发示例：
if(!this.downloadTask && !this.downloading ){
    console.log('开启下载任务....')
    this.downloadPackage()
}
	
//任务暂停示例：
this.abort()

```
> 注意： downloadPackage需要外部传递 url

#### screenshot.js

* 场景：屏幕截屏功能
* 兼容： H5、小程序、app-vue
* 用途：按需引入
* 示例：

```typescript
import screenshotMixin from '@/uni_modules/jasper-ui/libs/mixin/screenshot.js'
export default {
    mixins: [screenshotMixin],
    methods: {
        init: function() {
            this.screenshot().then(res => {
                //res 返回截屏本地图片的地址
                //截屏成功后做点什么  
                console.log(res)
            }, fail => {
                uni.showToast({
                    title: fail,
                    icon: 'none'
                })
            })
        }
    }
}
```

> 注意：  
page.$getAppWebview() 使用有bug  部分属性不全
建议使用 plus.webview.currentWebview() 获取当前的webView对象 还同时兼容 H5、App-vue
血的教训：之前能用，后面突然发现返回的路径一直是file://null，原来是 bitmap.save和 bitmap.clear的时间差的问题，
一定要把bitmap.clear放在成功回调函数或者失败函数里面。
在获取本地对象时，如果使用plus.webview.currentWebview()获取本地对象，有可能截屏时出现黑屏现象。

#### preventScroll.js

* 场景：防止遮罩层 滚动穿透  禁止蒙版后面的页面滑动效果, uni-popup 等相关遮罩案例
* 兼容：H5、小程序、app-vue
* 用途：按需引入
* 示例：

```vue
<script>
import preventScrollMixin from '@/uni_modules/jasper-ui/libs/mixin/preventScroll.js'
export default {
    mixins: [preventScrollMixin],
    methods: { }
}
</script>
<template>
<view :style="preventScrollStyle"> //最外层
    <uni-popup></uni-popup>
    //或者其他遮罩层
</view>
</template>

```

#### touch.js

* 场景：触摸移动相关的公共组件
* 兼容：H5、小程序、app-vue
* 用途：按需引入
* 示例：swiper-resistance.js

#### launchApp.js

* 场景：跳转第三方应用 如：微信、QQ、微博等 公共组件
* 兼容：全平台
* 用途：按需引入
* 参考：
    - https://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.launchApplication
    - https://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.ApplicationInf
* 结构定义：
  id: 应用的标识
  panme: 应用的包名 主要是用于安卓端 判断是否安装
  openURL	//打开应用的下载链接
  action	//程序的操作行为 Android平台上与系统的action值一致；iOS平台为要调用程序的URLScheme格式字符串。

#### checkbox.js

* 场景：checkbox 操作公共方法 包含方法：反选、单个、多选
* 兼容：全平台
* 用途：按需引入

#### change.js

* 场景：用于点击列表元素, 动态切换`activeColor` 触摸颜色
* 兼容：全平台
* 用途：按需引入
