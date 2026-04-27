# 帮助文档

本文档用于快速定位当前脚手架中已经集成的能力，以及对应的入口文件。

## 快速入口

- 应用入口: [main.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/main.js)
- 页面配置: [pages.json](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/pages.json)
- 全局样式: [uni.scss](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/uni.scss)
- 请求封装: [util/request/index.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/util/request/index.js)
- 请求拦截器: [util/request/requestInterceptors.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/util/request/requestInterceptors.js)
- 响应拦截器: [util/request/responseInterceptors.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/util/request/responseInterceptors.js)
- 全局常量插件: [common/plugins/constants.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/common/plugins/constants.js)
- 业务接口示例: [api/sample.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/api/sample.js)
- Mock 统一入口: [mock/index.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/index.js)
- Mock 路由定义: [mock/mock.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/mock.js)
- Mock 处理器: [mock/handler.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/handler.js)
- Mock 静态数据: [mock/data/index.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/data/index.js)

## 环境变量

当前项目使用 `.env` 系列文件管理环境变量，具体参考`Vite`文档

- https://cn.vitejs.dev/guide/env-and-mode#env-variables

`Vue2` 老版本参考：https://cli.vuejs.org/zh/guide/mode-and-env.html

当前是Vue3，采用 `VITE_` 前缀的变量会暴露给客户端代码。例如：

```bash
VITE_BASE_URL=http://127.0.0.1:9101
VITE_STATIC_HOST=http://127.0.0.1:9101
VITE_USE_MOCK=on
```

代码中通过 `import.meta.env` 读取：

```js
const baseUrl = import.meta.env.VITE_BASE_URL;
const staticHost = import.meta.env.VITE_STATIC_HOST;
```

注意：

- `.env` 文件放在项目根目录
- 修改 `.env.*` 后需要重启运行

## 当前已接入内容

### 基础能力

- `uv-ui`
- `jasper-ui`
- `Pinia`
- `dayjs`
- `crypto-js`

### 页面示例

- [pages/index/index.vue](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/pages/index/index.vue)
  包含 Pinia、接口调用、AES 加密、时间工具示例
- [pages/user/user.vue](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/pages/user/user.vue)
  包含 Mock 接口调用示例

### Store 示例

- [stores/sample.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/stores/sample.js)
- [stores/counter.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/stores/counter.js)

## Mock

当前仓库的 Mock 结构如下：

- `api/sample.js` 负责业务 API 暴露
- `mock/index.js` 负责统一 `callMock` 调用
- `mock/handler.js` 负责分页与响应包装
- `mock/data/index.js` 负责静态数据
- `mock/mock.js` 负责 `vite-plugin-mock` 路由定义

适用场景：

- H5 开发模式下，优先通过 `vite-plugin-mock` 命中 `/api/**`
- HBuilderX / App / 小程序场景下，直接使用 `api/sample.js` 的本地 mock 链路

## 文档目录

- [接口参数配置](./guides/api.md)
- [Mock 文档](./guides/mock.md)
- [PostCSS 文档](./guides/postcss.md)
- [Sass 迁移说明](./guides/sass.md)
- [时间工具](./guides/time.md)
- [MD5 / crypto-js](./guides/md5.md)
- [Husky + Commitlint + lint-staged 配置指南](./guides/husky.md)
- [Resources Guide](./guides/resources.md)
- [Prompt Guide](./guides/prototype-task-prompt-guide.md)
- [Workflow Example](./guides/codex-workflow-minimal-example.md)
- [待补充项](./pending.md)
- [更新日志](./changelog/changelog.md)
- [Codex Agents 协作说明](../AGENTS.md)

## jsconfig 一些编译项说明

### moduleResolution

`moduleResolution` 告诉 TypeScript/编译器**如何查找和解析模块文件**，简单说就是"当你写 `import xxx from 'yyy'` 时，去哪里找这个 `yyy`"。

**举个例子：**

```js
import { queryActivityList } from '@/api/activity'
import dayjs from 'dayjs'
```

编译器需要知道：
- `@/api/activity` 对应磁盘上哪个文件？
- `dayjs` 去 `node_modules` 哪个位置找？

不同的 `moduleResolution` 策略查找规则不同：

| 值 | 查找方式 |
|---|---|
| `node` | 模拟 Node.js CommonJS 的查找规则（旧版，已废弃） |
| `bundler` | 模拟 Vite/Webpack 打包工具的查找规则（推荐） |
| `node16` | 模拟 Node.js 16 ESM 的查找规则 |

**`bundler` 和 `node` 的主要区别：**

```js
// node 模式下必须写完整扩展名
import { foo } from './utils.js'

// bundler 模式下可以省略扩展名，打包工具会自动补全
import { foo } from './utils'      // ✅ 直接找 utils.js / utils.ts / utils/index.js
import { foo } from '@/utils'      // ✅ 支持路径别名
```

所以对于 uni-app 这种基于打包工具的项目，用 `bundler` 最符合实际运行环境。

## 其它说明

- 请求层统一入口在 `util/request`
- 加密能力统一使用 `crypto-js`
- 登录与主题相关扩展可参考 `uni_modules/jasper-ui` 和 `uni_modules/jasper-login`

## 常见问题

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
