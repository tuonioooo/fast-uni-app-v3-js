# 常见问题


### 全局静态变量定义、获取

```
//方式一
app.config.globalProperties.xxx = xxx; //nvue页面不支持

获取方式
const instance = getCurrentInstance();  
if(instance){
	const globalConstants = instance.appContext.config.globalProperties.$constants;
}

//方式二
uni.$b.xxx = xxx;	//全平台支持

直接使用 uni.$b.xxx

```

### 使用uni-app v3/vite 编译H5，代码单位是rpx，编译为了rem，能否设置编译为px

问题：[https://ask.dcloud.net.cn/question/151153](https://ask.dcloud.net.cn/question/151153)

解决方案：

1. 安装依赖
```cmd
npm install -D postcss-px-to-viewport
```
or

```cmd
yarn add -D postcss-px-to-viewport
```

2. vite.config.ts 配置插件

```text
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
//@ts-ignore
import postCssPxToViewPort from 'postcss-px-to-viewport';
import autoprefixer from 'autoprefixer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    postcss: {
      plugins: [
          //https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
        postCssPxToViewPort({ // 自适应，px>rem转换
          // 要转化的单位
          unitToConvert: 'rpx',
          // UI设计稿的大小
          viewportWidth: 750,
          // 转换后的精度
          unitPrecision: 6,
          // 转换后的单位
          viewportUnit: 'px',
          // 字体转换后的单位
          fontViewportUnit: 'px',
          // 能转换的属性，*表示所有属性，!border表示border不转
          propList: ['*'],
          // 指定不转换为视窗单位的类名，
          selectorBlackList: ['ignore-'],
          // 最小转换的值，小于等于1不转
          minPixelValue: 1,
          // 是否在媒体查询的css代码中也进行转换，默认false
          mediaQuery: false,
          // 是否转换后直接更换属性值
          replace: true,
          // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          exclude: [],
          // 包含那些文件或者特定文件
          include: [],
          // 是否处理横屏情况
          landscape: false
        }),
        autoprefixer({ // 自动添加前缀
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 8"
          ],
        })
      ]
    },
  }
});
```


参考官网：
* [配置文件详解](https://vitejs.dev/config/)
* [如何添加插件](https://vitejs.dev/guide/using-plugins.html)

运行上面代码后，h5页面将不会自动转换为rem

说明：

* vue2+vue-cli 方式直接配置 postcss.config.js 即可 可以参考官网
    * [postcss.config.js](https://uniapp.dcloud.net.cn/vue2-cli-release.html)
    * [rpx 转 px](https://uniapp.dcloud.net.cn/tutorial/adapt.html#_3-%E5%86%85%E5%AE%B9%E7%BC%A9%E6%94%BE%E6%8B%89%E4%BC%B8%E7%9A%84%E5%A4%84%E7%90%86)
* vue3+vite 需要在vite.config.js[ts] 中额外添加插件才可以生效



