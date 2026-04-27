# fast-uni-app-v3-js

基于 `uni-app + Vue3 + Pinia` 的快速开发脚手架，当前集成了 `uv-ui`、`jasper-ui`、统一请求拦截、Mock 示例、时间工具和 `crypto-js` 能力。

## 技术栈

- `uni-app`
- `Vue 3`
- `Pinia`
- `JavaScript`
- `Sass / SCSS`
- `@climblee/uv-ui`
- `jasper-ui`
- `dayjs`
- `crypto-js`
- `mockjs + vite-plugin-mock`
- `autoprefixer + postcss-px-to-viewport`

版本见 [package.json](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/package.json)。

## 安装与启动

```bash
pnpm install
```

启动前：

1. 在 [manifest.json](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/manifest.json) 中配置自己的 `appid`
2. 按需调整 `.env.*` 中的接口域名、静态资源域名和 `VITE_USE_MOCK`
3. 使用 HBuilderX 导入并运行项目

## 目录结构

```text
.
├─api                    业务接口与 mock 调用封装
├─common/plugins         全局插件，如常量注入
├─docs                   项目文档
├─mock                   mock 数据、处理器与统一入口
│  ├─data                纯静态 mock 数据
│  ├─handler.js          mock 公共处理函数
│  ├─index.js            mock 统一调用入口
│  └─mock.js             vite-plugin-mock 路由定义
├─pages                  页面示例
├─static                 静态资源
├─stores                 Pinia 示例
├─uni_modules            uni 扩展组件与 jasper 相关模块
├─util/request           请求配置与请求/响应拦截器
├─App.vue                应用入口组件
├─main.js                Vue3、Pinia、uv-ui、jasper-ui 挂载入口
├─pages.json             页面与 tabBar 配置
├─manifest.json          uni-app 应用配置
└─uni.scss               全局样式入口
```

## 已集成能力

- `main.js` 中已挂载 `Pinia`、`uv-ui`、`jasper-ui`、请求插件、常量插件
- `util/request` 中封装了统一 `baseURL`、请求拦截器、响应拦截器
- `common/plugins/constants.js` 中注入了 `BASE_URL`、`STATIC_HOST`、状态码等全局常量
- `stores/sample.js` 提供了组合式 Pinia 示例
- `api/sample.js` 提供了统一的业务接口与 mock 调用示例
- `pages/index/index.vue` 展示了 Pinia、请求、时间工具、AES 加密的基础用法
- `pages/user/user.vue` 展示了 Mock 接口调用示例

## Mock 说明

当前仓库的 Mock 分为三层：

- [mock/data/index.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/data/index.js)：纯静态 mock 数据
- [mock/handler.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/handler.js)：分页、响应包装等公共处理函数
- [mock/index.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/index.js)：统一 `callMock` 调用入口
- [mock/mock.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/mock.js)：`vite-plugin-mock` 路由定义
- [api/sample.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/api/sample.js)：业务 API 层，对上层页面暴露调用方法

说明：

- H5 开发模式下可通过 `vite-plugin-mock` 命中 `/api/**`
- HBuilderX / App / 小程序场景下，可直接通过 `api/sample.js -> mock/index.js` 这条链路调用本地 mock

## 文档导航

- [帮助文档](./docs/help.md)
- [接口参数配置](./docs/guides/api.md)
- [Mock 文档](./docs/guides/mock.md)
- [MD5 / crypto-js 文档](./docs/guides/md5.md)
- [PostCSS 文档](./docs/guides/postcss.md)
- [Sass 迁移说明](./docs/guides/sass.md)
- [Resources Guide](./docs/guides/resources.md)
- [Prompt Guide](./docs/guides/prototype-task-prompt-guide.md)
- [Workflow Example](./docs/guides/codex-workflow-minimal-example.md)
- [待补充项](./docs/pending.md)
- [更新日志](./docs/changelog/changelog.md)
- [Codex Agents 协作说明](./AGENTS.md)

## 说明

- 项目当前使用 `crypto-js` 处理摘要和加解密，兼容小程序场景
- 如果需要扩展登录、主题、组件能力，可以继续参考 `uni_modules/jasper-ui` 与 `uni_modules/jasper-login`
