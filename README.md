# fast-uni-app-v3-js

基于 `uni-app + Vue3 + Pinia` 的快速开发脚手架，当前项目集成了 `uv-ui`、`jasper-ui`、请求拦截器、Mock 示例、时间工具和 `crypto-js` 加密能力，适合作为 uni-app 新项目的起点。

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

具体版本见 [package.json](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/package.json)。

## 安装与使用

```bash
pnpm install
# 或
npm install
```

### 启动前

1. 在 [manifest.json](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/manifest.json) 中配置自己的 `appid`
2. 使用 HBuilderX 导入并运行项目
3. 按需修改接口域名、静态资源域名等环境常量

> 当前仓库 `package.json` 里没有额外封装 dev/build 脚本，默认以 HBuilderX 调试和打包为主。

## 项目结构

```text
.
├─api                    接口封装与 mock 接口调用示例
├─common/plugins         全局插件，如常量注入
├─docs                   项目文档
├─mock                   vite-plugin-mock 模拟数据
├─pages                  页面示例
├─static                 静态资源
├─stores                 Pinia 状态示例
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
- `api/sample.ts`、`api/mock/mock.js` 提供了接口调用示例
- `pages/index/index.vue` 展示了 Pinia、请求、时间工具、AES 加密的基础用法
- `pages/user/user.vue` 展示了 Mock 接口调用示例

## 文档导航

- [帮助文档](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/help.md)
- [接口参数配置](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/api.md)
- [Mock 文档](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/mock.md)
- [MD5 / crypto-js 文档](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/md5.md)
- [PostCSS 文档](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/postcss.md)
- [Sass 迁移说明](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/sass.md)
- [常见问题](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/problem.md)
- [更新日志](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/docs/changelog/changelog.md)

## 说明

- 项目当前使用 `crypto-js` 处理摘要和加解密，兼容小程序场景
- 如果你需要扩展登录、主题、组件能力，可以继续参考 `uni_modules/jasper-ui` 与 `uni_modules/jasper-login`
