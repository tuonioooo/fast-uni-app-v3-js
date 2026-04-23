# 帮助文档

本文档用于快速定位当前脚手架内已经集成的能力，以及对应的入口文件。

## 快速入口

- 应用入口: [main.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/main.js)
- 页面配置: [pages.json](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/pages.json)
- 全局样式: [uni.scss](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/uni.scss)
- 请求封装: [util/request/index.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/util/request/index.js)
- 请求拦截器: [util/request/requestInterceptors.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/util/request/requestInterceptors.js)
- 响应拦截器: [util/request/responseInterceptors.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/util/request/responseInterceptors.js)
- 全局常量插件: [common/plugins/constants.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/common/plugins/constants.js)
- Mock 数据: [mock/mock.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/mock/mock.js)
- 示例接口: [api/sample.ts](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/api/sample.ts)
- Mock 接口调用: [api/mock/mock.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/api/mock/mock.js)

## 环境变量配置

uni-app 默认项目（HBuilderX 创建）配置环境变量有以下方式：

---

### 方式一：`.env` 文件（推荐）

在项目根目录创建对应文件：

```
.env                # 所有环境都加载
.env.development    # 开发环境
.env.production     # 生产环境
```

文件内容，变量名**必须以 `VITE_` 开头**才能在代码里访问：

```bash
# .env.development
VITE_BASE_URL=https://dev-api.example.com
VITE_APP_NAME=我的应用-dev

# .env.production  
VITE_BASE_URL=https://api.example.com
VITE_APP_NAME=我的应用
```

代码里使用：

```javascript
const baseUrl = import.meta.env.VITE_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
```

---

### 方式二：uni-app 内置环境判断

不需要配置，直接用：

```javascript
// 判断开发/生产
if (process.env.NODE_ENV === 'development') {
    console.log('开发环境')
}

if (process.env.NODE_ENV === 'production') {
    console.log('生产环境')
}
```

---

### 方式三：条件编译（平台区分）

```javascript
// #ifdef H5
console.log('只在H5执行')
// #endif

// #ifdef MP-WEIXIN
console.log('只在微信小程序执行')
// #endif

// #ifdef APP-PLUS
console.log('只在App执行')
// #endif
```

---

### 实际项目常用写法

封装一个 `config.js` 统一管理：

```javascript
// src/config/index.js
const isDev = import.meta.env.DEV  // vite 内置，开发环境为 true

const config = {
    baseUrl: import.meta.env.VITE_BASE_URL,
    appName: import.meta.env.VITE_APP_NAME,
    isDev,
}

export default config
```

---

### 注意事项

- `.env` 文件放在**项目根目录**，和 `pages.json` 同级
- 只有 `VITE_` 前缀的变量才会暴露给客户端代码，避免敏感信息泄露
- HBuilderX 修改 `.env` 文件后需要**重新运行**才生效


## 当前项目已接入内容

### 组件与基础库

- `uv-ui`：基础 UI 组件库
- `jasper-ui`：扩展组件、工具函数、加密与时间能力
- `Pinia`：状态管理
- `dayjs`：日期处理
- `crypto-js`：MD5、AES、DES 能力

### 页面示例

- [pages/index/index.vue](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/pages/index/index.vue)
  包含 Pinia、接口调用、AES 加密、时间工具示例
- [pages/user/user.vue](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/pages/user/user.vue)
  包含 Mock 接口调用示例

### Store 示例

- [stores/sample.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/stores/sample.js)
- [stores/counter.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/stores/counter.js)

## 文档目录

### 接口与请求

- [接口参数配置](api.md)
- [Mock 文档](mock.md)

### 样式与构建

- [PostCSS 文档](postcss.md)
- [Sass 迁移说明](sass.md)

### 工具能力

- [时间工具](time.md)
- [MD5 / crypto-js](md5.md)

### 其他

- [常见问题](problem.md)
- [更新日志](changelog/changelog.md)

## 项目说明

### 请求封装

`util/request/index.js` 中统一设置了全局 `baseURL`，并挂载了请求与响应拦截器。

请求配置支持通过 `custom` 扩展控制行为，具体见 [接口参数配置](api.md)。

### Mock

当前仓库保留了 `mock/mock.js` 和 `api/mock/mock.js` 两层示例：

- `mock/mock.js` 负责定义 mock 数据
- `api/mock/mock.js` 负责封装 mock 接口调用

### 加密

当前项目统一使用 `crypto-js`，不要再使用旧的 `js-md5` 文档或示例。

如果只做摘要，直接用 `CryptoJS.MD5`；如果要加解密，可直接使用 `uni.$unc.encryptAES` / `uni.$unc.decryptAES`。

### uni_modules

- jasper-ui 文档: [uni_modules/jasper-ui/readme.md](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/uni_modules/jasper-ui/readme.md)
- jasper-login 文档: [uni_modules/jasper-login/readme.md](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/uni_modules/jasper-login/readme.md)
