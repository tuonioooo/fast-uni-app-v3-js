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

- [接口参数配置](api.md)
- [Mock 文档](mock.md)
- [PostCSS 文档](postcss.md)
- [Sass 迁移说明](sass.md)
- [时间工具](time.md)
- [MD5 / crypto-js](md5.md)
- [常见问题](problem.md)
- [Husky + Commitlint + lint-staged 配置指南](./husky.md)
- [更新日志](changelog/changelog.md)

## 其它说明

- 请求层统一入口在 `util/request`
- 加密能力统一使用 `crypto-js`
- 登录与主题相关扩展可参考 `uni_modules/jasper-ui` 和 `uni_modules/jasper-login`
