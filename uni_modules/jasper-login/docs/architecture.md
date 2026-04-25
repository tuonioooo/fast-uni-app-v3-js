# jasper-login 架构说明

## 目标

这个文件专门说明当前模块里关键文件的作用和使用方式，方便维护时快速定位，不需要靠全文搜索猜职责。

## 配置层

### `config/base.js`

作用：
- 放模块的基础默认配置
- 不关心平台差异
- 统一维护模块内部页面路径，例如登录页、短信页、协议页

使用方式：
- 新增一个默认配置项时，优先放在这里
- 登录、注册、短信验证码、协议相关 PATH 优先维护在 `paths` 字段

### `config/platform-overrides.js`

作用：
- 承载 `APP / MP-WEIXIN` 这类条件编译差异
- 只描述平台覆盖，不做运行时校验

使用方式：
- 某个登录方式只在某个平台可用时，放在这里维护

### `utils/normalize-config.js`

作用：
- 对配置做运行时归一化
- 去重、过滤非法登录类型、补默认值、修正边界
- 保证 `paths` 和 `agreements` 这类结构始终可用

使用方式：
- 新增配置项时，如果页面层依赖稳定结构，就在这里补归一化逻辑

### `config.js`

作用：
- 统一拼装 `base config + platform overrides + runtime normalization`
- 对外提供最终可直接使用的配置对象

使用方式：
- 页面和组件只 import 这个文件，不直接拼装各层配置

## 页面与流程层

### `pages/login/login-withoutpwd.vue`

作用：
- 免密登录入口页
- 负责展示登录方式、收集手机号、触发三方登录

使用方式：
- 页面只保留展示层和少量平台逻辑
- 登录成功处理、短信跳转、三方回调解析优先走 hooks

### `pages/login/login-smscode.vue`

作用：
- 短信验证码输入页
- 自管理发码、倒计时、验证码登录

使用方式：
- 通过路由参数 `phone` 和 `autoSend` 打开

### `pages/login/login-withpwd.vue`

作用：
- 账号密码登录页

使用方式：
- 调用统一服务入口 `common/login-api.js`
- 登录成功处理复用 `useLoginFlow`

### `hooks/use-login-flow.js`

作用：
- 统一处理登录成功后的落库、提示、redirect 跳转

使用方式：
- 所有登录页都优先通过它处理成功结果

### `hooks/use-sms-login.js`

作用：
- 抽离手机号输入格式化、手机号校验、短信页跳转、短信请求前检查

使用方式：
- 页面里不要重复写手机号格式化和网络检查逻辑

### `hooks/use-third-party-login.js`

作用：
- 统一判断哪些登录方式属于三方快速登录
- 统一解析微信手机号授权事件

使用方式：
- 三方登录页只调用这里的方法，不直接散写 `if (type === xxx)`

## 服务层

### `common/login-api.js`

作用：
- 页面层统一调用入口

使用方式：
- 页面和组件统一 import 这里
- 不直接 import 具体服务文件

### `services/auth-service.js`

作用：
- 默认 mock 服务实现
- 便于脚手架开箱演示

使用方式：
- 快速演示时直接使用
- 生产环境可直接替换函数体，或通过注册中心注入宿主实现

### `services/service-registry.js`

作用：
- 当前生效服务和 hooks 的注册中心

使用方式：
- 宿主在 `app.use(JasperLogin, options)` 时注入
- `common/login-api.js` 和 `utils/login-success.js` 都从这里读取当前实现

## 状态与工具层

### `stores/user.js`

作用：
- 维护 token、userInfo、accountId
- 提供默认持久化实现

使用方式：
- 默认 hooks 会调用它
- 宿主如果要接管持久化，可以通过 install hooks 覆盖

### `utils/login-success.js`

作用：
- 统一判断登录接口成功与否
- 统一执行登录成功 hooks

使用方式：
- 登录页不要重复写落库逻辑

### `utils/runtime-deps.js`

作用：
- 显式收口 `uni.$jasper / uni.$constants` 依赖

使用方式：
- 页面和服务层优先通过这个文件读取宿主运行时能力

## 示例与类型

### `docs/examples/minimal-app-use.js`

作用：
- 提供最小接入示例

使用方式：
- 宿主项目可以直接参考这里的安装方式

### `docs/examples/sample-auth-api.js`

作用：
- 保留旧版示例接口作为参考

使用方式：
- 不参与主流程，只作参考

### `types/jasper-login.d.ts`

作用：
- 给接入方提供更稳定的安装参数和服务签名参考

使用方式：
- JS 项目可作为接口约定参考
- TS 项目可直接参考这些类型结构进行适配
