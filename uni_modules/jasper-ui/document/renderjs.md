### 介绍

官方地址：[https://uniapp.dcloud.net.cn/tutorial/renderjs.html#renderjs](https://uniapp.dcloud.net.cn/tutorial/renderjs.html#renderjs)
官方demo: [https://ext.dcloud.net.cn/plugin?id=1207](https://ext.dcloud.net.cn/plugin?id=1207)

### `renderjs`使用注意事项：
* 目前仅支持内联使用。
* 不要直接引用大型类库，推荐通过动态创建 script 方式引用。
* 可以使用 vue 组件的生命周期(不支持 beforeDestroy、destroyed、beforeUnmount、unmounted)，不可以使用 App、Page 的生命周期
* 视图层和逻辑层通讯方式与 WXS 一致，另外可以通过 this.$ownerInstance 获取当前组件的 ComponentDescriptor 实例。
* 注意逻辑层给数据时最好一次性给到渲染层，而不是不停从逻辑层向渲染层发消息，那样还是会产生逻辑层和视图层的多次通信，还是会卡
* 观测更新的数据在视图层可以直接访问到。
* APP 端视图层的页面引用资源的路径相对于根目录计算，例如：./static/test.js。
* APP 端可以使用 dom、bom API，不可直接访问逻辑层数据，不可以使用 uni 相关接口（如：uni.request）
* H5 端逻辑层和视图层实际运行在同一个环境中，相当于使用 mixin 方式，可以直接访问逻辑层数据。

### 相关的操作方法 经验
* props 中的属性 不要定义 这样 在updateRenderData 中 this.listenPage = listenPage 赋值后 可以在renderjs中直接使用this.listenPage
* H5 端逻辑层和视图层实际运行在同一个环境中，相当于使用 mixin 方式，可以直接访问逻辑层数据，APP端则需要传递观测数据
  如：
  ```
  <!--逻辑层  -->
  <template>
      <view :prop="renderData" :change:prop="updateRenderData">
          // you coding
      </view>
  <template>
  <script>
      export default {
          computed: {
              renderData(){
                  return {
                      current: 0,
                      lastIndex:  2
                  }
              }
          },
      }
  </script>
  <!--视图层  -->
  <script module="test" lang="renderjs">
      export default {
          data(){
              return{
                  rd: null,
              }
          },
          mounted() {
              // ...
          },
          methods: {
              updateRenderData(newValue, oldValue, ownerInstance, instance) {
                  //todo something 必须要有这个方法 否则 无法观察更新的数据
                  this.rd = newValue;
              }
          }
      }
  </script>
  ```
* 调用renderjs方法不能传递参数
* 调用逻辑层的方法：
    - 传递多个参数示例
      `this.$ownerInstance.callMethod('handleSwiperClick', {...//传递参数});`
    - 传递单个参数
      `this.$ownerInstance.callMethod('handleSwiperClick', 参数);`
* 尽量在逻辑层view节点中调用视图层中的方法

### 使用组件

* [keyboard-listener.js](../libs/function/renderjs/keyboard-listener.js)
* [swiper-resistance.js](../libs/function/resistance/swiper-resistance.js)