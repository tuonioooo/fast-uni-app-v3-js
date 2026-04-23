# postcss

### 介绍

PostCSS 是一个使用 JS 插件转换样式的工具。这些插件可以对你的 CSS 进行转换处理，支持变量和 mixin，转译未来的 CSS 语法、内联图像等等。

避免手动去计算，px转成rem、vw，因为将是一个很耗时、费力的过程。

PostCSS是一个用 JavaScript 工具和插件转换 CSS 代码的工具，类似babel对js的处理。常见的功能如：

1. 使用下一代css语法(cssnext)

2. 自动补全浏览器前缀(autoprefixer)

3. 自动把px代为转换成rem(postcss-pxtorem)/vw(postcss-px-to-viewport)

4. css代码压缩


官网：[https://postcss.org/](https://postcss.org/)  
gitHub:[https://github.com/postcss/postcss](https://github.com/postcss/postcss)

### autoprefixer

PostCSS 插件，用于解析 CSS 并使用 Can I Use 中的值向 CSS 规则添加浏览器的前缀。它由谷歌推荐，并在 Twitter 和阿里巴巴中使用。

官网: [https://github.com/postcss/autoprefixer](https://github.com/postcss/autoprefixer)

#### 安装

```cmd
npm install postcss autoprefixer -D
```

or

```cmd
yarn add postcss autoprefixer -D
```

如果已安装 postcss 可以忽略


#### 简单示例

* vue2-示例1

```js
// 根目录新建 postcss.config.js

module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

* vue2-示例2

```js
// 根目录新建 postcss.config.js
module.exports = {
  plugins: {
    'autoprefixer': {
        overrideBrowserslist: ["Android >= 4", "ios >= 8"],
        remove: process.env.UNI_PLATFORM !== 'h5'
    },
  }
};
```

* vue3-示例

```js
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import autoprefixer from 'autoprefixer'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni()],
    css: {
        postcss: {
            plugins: [
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
        }
    }
}) 
```

### postcss-pxtorem

#### 介绍

PostCSS 的插件，从px单位生成 rem 单位。
官网：[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)

#### 安装

```cmd
npm install postcss-pxtorem -D
```
or 

```cmd
yarn add postcss-pxtorem -D
```

* vue2配置示例

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.ignore'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  }
};
```

* vue3配置示例

```js
// vite.config.js
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
//@ts-ignore
import postCssPxToRem from 'postcss-pxtorem';
// https://vitejs.dev/config/
// @ts-check
export default defineConfig({
    // @ts-check
    plugins: [uni()],
    css: {
        postcss: {
            plugins: [
                //https://github.com/cuth/postcss-pxtorem
                postCssPxToRem({
                    rootValue: 16,      // html节点设的font-size大小，由于chrome最小12px，所以基值要设置大写
                    unitPrecision: 5,   // 转rem精确到小数点多少位
                    propList: ['*'],    // 指定转换成rem的属性，eg: ['font','font-size','line-height','letter-spacing'], * 代表全支持
                    selectorBlackList: ['.ignore'], // str或reg ，指定不转换的选择器，str时包含字段即匹配
                    replace: true,
                    mediaQuery: false, 
                    minPixelValue: 0 // 媒体查询内的px是否转换minPixelValue:0// 小于指定数值的px不转换
                })
            ]
        },
    }
});
```



### postcss-px-to-viewport

#### 介绍

PostCSS 的插件，将 px 转换为视口单位（vw, vh, vmin, vmax）, 一种更好的方案。
官网：[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)

#### 安装

```cmd
npm install postcss-px-to-viewport -D
```
or

```cmd
yarn add postcss-px-to-viewport -D
```

#### 默认选项

```text
{
  unitToConvert: 'px',
  viewportWidth: 320,
  unitPrecision: 5,
  propList: ['*'],
  viewportUnit: 'vw',
  fontViewportUnit: 'vw',
  selectorBlackList: [],
  minPixelValue: 1,
  mediaQuery: false,
  replace: true,
  exclude: undefined,
  include: undefined,
  landscape: false,
  landscapeUnit: 'vw',
  landscapeWidth: 568
}
```

#### 配置示例

* vue2-示例1

```js
//vue2 根目录新建 postcss.config.js
// 示例1
const path = require('path')
module.exports = {
    parser: 'postcss-comment',
    plugins: {
        'postcss-import': {
            resolve(id, basedir, importOptions) {
                if (id.startsWith('~@/')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
                } else if (id.startsWith('@/')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
                } else if (id.startsWith('/') && !id.startsWith('//')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
                }
                return id
            }
        },
        'autoprefixer': {
            overrideBrowserslist: ["Android >= 4", "ios >= 8"],
            remove: process.env.UNI_PLATFORM !== 'h5'
        },
        //示例1
        'postcss-px-to-viewport': {
            unitToConvert:'px',//要转换的单位，默认是'px'
            viewportWidth: 750,// 视窗的宽度，对应的是我们设计稿的宽度，一般是750，默认是320
            viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3,// 指定`px`转换为视窗单位值的小数位数，默认是5
            propList: ['*'], //指定可以转换的css属性，默认是['*']，代表全部属性进行转换
            viewportUnit: "vw", //指定需要转换成的视窗单位，建议使用vw
            fontViewportUnit: 'vw', //指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['.ignore'],// 指定不转换为视窗单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false, // 允许在媒体查询中转换`px`
            replace: true,
            exclude: [],//设置忽略文件，如node_modules
        }
    }
}


```

* vue2-示例2

```js
//示例2
const path = require('path')
module.exports = {
    parser: 'postcss-comment',
    plugins: {
        'postcss-import': {
            resolve(id, basedir, importOptions) {
                if (id.startsWith('~@/')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
                } else if (id.startsWith('@/')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
                } else if (id.startsWith('/') && !id.startsWith('//')) {
                    return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
                }
                return id
            }
        },
        'autoprefixer': {
            overrideBrowserslist: ["Android >= 4", "ios >= 8"],
            remove: process.env.UNI_PLATFORM !== 'h5'
        },
        // 借助postcss-px-to-viewport插件，实现rpx转px，文档：https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
        // 以下配置，可以将rpx转换为1/2的px，如20rpx=10px，如果要调整比例，可以调整 viewportWidth 来实现
        'postcss-px-to-viewport': {
            unitToConvert: 'rpx',
            viewportWidth: 200,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'px',
            fontViewportUnit: 'px',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: undefined,
            include: undefined,
            landscape: false
        },
        '@dcloudio/vue-cli-plugin-uni/packages/postcss': {}
    }
}
```

* vue3配置示例

```js
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
          autoprefixer({ // 自动添加前缀
              env: 'h5',
              remove: process.env.UNI_PLATFORM == 'h5',   //仅支持h5
              supports: process.env.UNI_PLATFORM == 'h5', //仅支持h5
              //在app环境下 不追加编译前缀
              overrideBrowserslist: process.env.UNI_PLATFORM === 'h5'
                  ? [
                      "Android 4.1",
                      "iOS 7.1",
                      "Chrome > 31",
                      "ff > 31",
                      "ie >= 8"
                  ]
                  : [],
          }),
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
      ]
    },
  }
});
```

### postcss-px-to-viewport 和 postcss-pxtorem 的区别


| 特性          | postcss-px-to-viewport           | postcss-pxtorem                     |
|-------------|----------------------------------|-------------------------------------|
| **用途**      | 将 px 转换为视口单位（vw, vh, vmin, vmax） | 将 px 转换为 rem                        |
| **转换单位**    | 视口单位（vw, vh, vmin, vmax）         | rem                                 |
| **视口设置**    | 需要配置视口宽度和高度                      | 不需要视口设置                             |
| **响应式设计**   | 更适合响应式设计，根据视口大小调整元素尺寸            | 适用于使用 rem 单位的响应式设计                  |
| **根元素字体大小** | 不受影响                             | 需要设置根元素的字体大小（html { font-size: x }) |
| **典型用例**    | 移动端网页设计                          | 使用 rem 进行响应式布局                      |
| **兼容性**     | 支持所有现代浏览器                        | 支持所有现代浏览器                           |
| **配置复杂度**   | 需要配置视口单位、选择器忽略等                  | 需要配置转换基准、选择器忽略等                     |
| **常见问题**    | 可能导致视口单位计算不准确                    | 需要确保所有设计元素基于 rem 单位                 |


更详细内容请查看官网： 

* [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)
* [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)


### 说明

- 以上所有示例 有部分是基于uni-app插件 搭建的配置，如不需要 移除即可.

#### uni-app 没有内置 `postcss` 和 `autoprefixer`

- 需要手动安装依赖
- 必须在 vite.config.js 中配置，而不是 postcss.config.js
