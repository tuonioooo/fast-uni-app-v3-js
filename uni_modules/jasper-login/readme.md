# jasper-login

## 基础概览

### 介绍

登录页面组件，封装验证码登录、账号密码登录、其他第三方登录等

### 依赖配置

依赖 `uv-ui`、`jasper-ui` 组件库，依赖 `uni-popup`、`uni-transition`

### 宿主依赖说明

当前模块默认假设宿主项目已经提供以下运行时能力：

- `uni.$jasper.showToast(message)`
- `uni.$jasper.toast(message)`
- `uni.$jasper.trim(value, 'all')`
- `uni.$jasper.isMobile(phone)`
- `uni.$jasper.hasNetwork()`
- `uni.$jasper.randomDigitString(length)`
- `uni.$jasper.theme['$jasper-primary']`
- `uni.$jasper.theme['$jasper-primary-inverse']`
- `uni.$constants.RESULT_SUCCESS_CODE`

从当前版本开始，这些依赖已统一收口到：

- `utils/runtime-deps.js`

也就是说，页面和服务层不再推荐直接散落访问 `uni.$jasper / uni.$constants`，而是通过
`runtime-deps.js` 统一读取。这样做的目的有两个：

1. 把 jasper-login 对宿主的依赖能力显式列出来
2. 便于后续替换宿主实现、补 fallback、做文档和排查问题

如果你的宿主项目没有接入 `jasper-ui`，至少需要提供上面列出的等价能力，
或者自行调整 `utils/runtime-deps.js` 中的实现。

### 目录结构

```text
├─common                            //公共用文件
│  ├─login-agreements-mixin.js      //同意协议公共方法
│  ├─login-page.scss                //登录页面样式
│  └─login-api.js                   //登录服务统一调用出口
├─components
│  ├─login-agreements               //勾选协议组件
│  ├─login-methods                  //登录方式组件，负责授权入口与 provider 结果回传
│  └─jasper-login                   //统一对外入口组件
├─config
│  ├─base.js                        //基础默认配置
│  └─platform-overrides.js          //平台差异覆盖配置
├─constants                         //登录类型、结果码等常量定义
├─docs                              //架构说明、更新日志、接入补充文档
│  ├─examples
│  │  ├─minimal-app-use.js          //最小可运行接入示例
│  │  └─sample-auth-api.js          //演示环境示例接口，已降级为参考代码
│  ├─architecture.md                //架构说明
│  ├─changelog.md                   //更新日志
│  ├─weixin.md                      //微信登录接入说明
│  └─优化建议清单.md                 //优化记录与待办
├─hooks
│  ├─use-login-flow.js              //登录成功后的统一流程编排
│  ├─use-sms-login.js               //短信登录表单辅助逻辑
│  └─use-third-party-login.js       //三方登录辅助逻辑
├─pages
│  ├─agreements                     //协议页面,通过web-view跳转到/hybrid 中的协议页面
│  └─login                          //登录页面
│    └─login-smscode                //短信验证码输入页
│    └─login-withoutpwd             //登录页面不需要密码的总入口（一键登录、三方登录都走这里）
│    └─login-withpwd                //用户名、密码登录页
├─static                            //静态资源、设计到三方登录的图片
│  ├─app-plus
│  │  └─unc-fab-login
│  ├─limeClipper
│  └─login
│      └─unc-fab-login
├─services                          //登录服务层，默认是 mock，便于快速演示
├─stores                            //状态管理，这里用 Pinia 保存用户登录信息
├─types                             //类型声明与接口约定
├─utils                             //工具层，包括登录成功处理和运行时依赖收口
└─uniCloud                          //一键登录云函数功能
```

### 配置说明

#### 页面配置

* page.json 引入登录组件,采用uni-app的分包机制

```json
{
"subPackages": [
    {
      "root": "uni_modules/jasper-login",
      "pages": [
        {
          "path": "pages/login/login-withoutpwd",
          "style": {
            "navigationStyle": "custom"
          }
        },
        {
          "path": "pages/login/login-withpwd",
          "style": {
            "navigationStyle": "custom"
          }
        },
        {
          "path": "pages/login/login-smscode",
          "style": {
            "navigationStyle": "custom"
          }
        },
        {
          "path": "pages/agreements/agreement",
          "style": {}
        },
        {
          "path": "pages/agreements/privacy",
          "style": {}
        }
      ]
    }
  ]
}
```
#### config.js配置

说明：

1. `config/base.js` 提供基础默认配置  
2. `config/platform-overrides.js` 提供平台差异覆盖  
3. `utils/normalize-config.js` 负责运行时归一化和边界修正  
4. `config.js` 统一导出最终可用配置  

当前版本建议把登录、注册、短信验证码、协议页等模块内页面路径统一维护在
`config/base.js -> paths` 中，页面跳转、路由拦截、协议链接默认都会读取这里，
后续如果目录调整，只需要改这一处。

> * 配置 hybrid 文件夹, 用于保存隐私协议相关的页面, 这里主要是用于web-view调整到这里本地的页面  
>   * 如果用HBuilderX创建的项目,需要在根目录中配置 hybrid 文件夹  
>   * 如果用vue-cli 需要在src目录中 配置hybrid 文件夹  

具体内容如下：

```js
export default {
	//调试模式
	"debug": false,
	// 模块内页面路径统一在这里维护
	"paths": {
		"moduleRoot": "/uni_modules/jasper-login",
		"pagePrefix": "/uni_modules/jasper-login/pages/",
		"login": "/uni_modules/jasper-login/pages/login/login-withoutpwd",
		"passwordLogin": "/uni_modules/jasper-login/pages/login/login-withpwd",
		"smsCode": "/uni_modules/jasper-login/pages/login/login-smscode",
		"agreement": "/uni_modules/jasper-login/pages/agreements/agreement",
		"privacy": "/uni_modules/jasper-login/pages/agreements/privacy"
	},
	/*
		登录类型 未列举到的或运行环境不支持的，将被自动隐藏。
		如果需要在不同平台有不同的配置，直接用条件编译即可
	*/
	"isAdmin": false, // 区分管理端与用户端

	/**
	 * 登录类型：当前列表中所支持的登录类型有哪些，按照顺序加载
	 */
	"loginTypes": [
		// "qq",
		// "xiaomi",
		// "sinaweibo",
		// "taobao",
		// "facebook",
		// "google",
		// "alipay",
		// "douyin",

		// #ifdef APP
		"univerify",
		// #endif
		//"weixin",
		//"username",
		// #ifdef APP
		//"apple",
		// #endif

		// #ifdef APP
		'univerify',	//开启本机号码一键登录方式
		// #endif

		// #ifdef APP
		//'apple',
		// #endif

		// #ifdef MP-WEIXIN
		'weixinMobile',	//开启微信手机号登录方式(含小程序登录方式)
		// #endif

		// #ifndef MP-WEIXIN
		//'weixin',		//开启微信登录方式
		//#endif

		//'username',	//开启用户名密码登录方式
		'smsCode', 		//开启验证码登录方式
	],
	//政策协议
	"agreements": {
		"serviceUrl": "/uni_modules/jasper-login/pages/agreements/agreement?needNav=1", //用户服务协议链接，默认建议基于 paths.agreement 派生
		"privacyUrl": "/uni_modules/jasper-login/pages/agreements/privacy?needNav=1", //隐私政策条款链接，默认建议基于 paths.privacy 派生
		// 哪些场景下显示，1.注册（包括登录并注册，如：微信登录、苹果登录、短信验证码登录）、2.登录（如：用户名密码登录）
		"scope": [
			'register', 'login'
		]
	},
	// 提供各类服务接入（如微信登录服务）的应用id
	"appid": {
		"weixin": {
			// 微信公众号的appid，来源:登录微信公众号（https://mp.weixin.qq.com）-> 设置与开发 -> 基本配置 -> 公众号开发信息 -> AppID
			"h5": "xxxxxx",
			// 微信开放平台的appid，来源:登录微信开放平台（https://open.weixin.qq.com） -> 管理中心 -> 网站应用 -> 选择对应的应用名称，点击查看 -> AppID
			"web": "xxxxxx",
			"miniapp": "wxc119f8aa174f8dac", //小程序appid
		}
	},
	/**
	 * 密码强度
	 * super（超强：密码必须包含大小写字母、数字和特殊符号，长度范围：8-16位之间）
	 * strong（强: 密密码必须包含字母、数字和特殊符号，长度范围：8-16位之间）
	 * medium (中：密码必须为字母、数字和特殊符号任意两种的组合，长度范围：8-16位之间)
	 * weak（弱：密码必须包含字母和数字，长度范围：6-16位之间）
	 * 为空或false则不验证密码强度
	 */
	"passwordStrength":"medium",
	/**
	 * 登录后允许用户设置密码（只针对未设置密码得用户）
	 * 开启此功能将 setPasswordAfterLogin 设置为 true 即可
	 * "setPasswordAfterLogin": false
	 *
	 * 如果允许用户跳过设置密码 将 allowSkip 设置为 true
	 * "setPasswordAfterLogin": {
	 *   "allowSkip": true
	 * }
	 * */
	"setPasswordAfterLogin": false
}

```

当前版本配置已经形成三层结构：

- `base config`
- `platform overrides`
- `runtime normalization`

这样做的意义是：

1. 基础配置和平台差异分开维护
2. 页面层只读取最终稳定配置
3. 新增配置项时可以明确放在哪一层处理

其中和页面跳转相关的路径建议统一放在 `paths` 中：

- `paths.login` 免密登录入口页
- `paths.passwordLogin` 账号密码登录页
- `paths.smsCode` 短信验证码输入页
- `paths.agreement` 用户协议页
- `paths.privacy` 隐私协议页

当前模块内以下逻辑会直接读取这些路径配置：

- `<jasper-login />` 默认跳转登录页
- 路由拦截器未登录时的跳转页
- 短信登录跳转验证码页
- 底部登录方式切换页
- 协议组件默认链接

#### 一键登录配置

如果使用一键登录功能, 需要集成如下云端组件：

1.在uni_modules 中集成 uni-config-center、uni-id-common两个云端组件 默认已经集成了。  
2.在HBuilderX根目录中, 右键创建uniCloud云开发环境，创建成功后会默认将uni-config-center、uni-id-common、uni-id-co（一键登录云对象组件）整合到一起  
3.在uni-config-center中配置好一键登录的配置信息  

```json
{
"service": {
    "sms": {
      "name": "应用名称，对应短信模版的name",
      "codeExpiresIn": 300,
      "smsKey": "a3cf411dc2f762ef0a2d0e70da8b6598",
      "smsSecret": "1374e461c1fcb62eed8e6df181db2b4d"
    },
    "univerify": {
      "appid": "__UNI__EFA129C",
      "apiKey": "xxxxxxxxx",
      "apiSecret": "xxxxxxxxxxx"
    }
  }
}
```

#### stores配置

用户登录成功后，会自动将用户信息存储到本地，这里使用的是vuex 为了兼容vue2, 主要是在jasper-ui 中的stores/index.js中 安装插件后会自动安装

开发者可以自定义此文件，或者是说删除掉，重新在src/根目录中新建 userStore.js/ts 来存储用户状态信息

注意：  
  * stores配置默认是为完善jasper-login登录过程,开发这可以完全自定义修改或删除
  * 自定义目录的位置  
    * 如果项目是用HBuilderX创建的项目且发布平台是小程序, 当前文件应该放到 根目录下  
    * 如果项目是用vue-cli创建的项目且发布平台是小程序, 当前文件应该放到 src目录下  

#### 服务层说明

- `common/login-api.js` 是页面层统一调用入口
- `services/auth-service.js` 默认提供的是 mock 实现，目的是让脚手架开箱即可跑通演示链路
- `docs/examples/sample-auth-api.js` 是旧版示例接口，已经降级为参考代码，不再参与主流程
- `services/service-registry.js` 是服务注册中心，负责接收宿主注入并提供当前生效的服务与 hooks
- `hooks/use-login-flow.js`、`use-sms-login.js`、`use-third-party-login.js` 负责页面流程编排和页面辅助逻辑

建议接入方式：

1. 页面层继续只调用 `common/login-api.js`
2. 生产环境直接替换 `services/auth-service.js` 中的函数体
3. 保持函数签名不变，例如：
   - `sendSms(params)`
   - `verifySms(params)`
   - `loginByPhone(params)`
   - `loginByPassword(params)`
   - `getPhoneInfoByCode(params)`

这样页面和组件层不用改，替换成本最低。

#### vue-cli / CLI 命令脚本参考

如果宿主项目不是纯 `HBuilderX` 运行模式，而是 `vue-cli / CLI` 驱动方式，可以在宿主工程的 `package.json` 中补齐标准 `dev:*`、`build:*` 命令。

当前仓库根目录已经保留了一份可直接参考的脚本模板：

- [script.json](./docs/script.json)

可按宿主项目实际场景保留需要的平台命令，例如：

- `dev:h5`
- `build:h5`
- `dev:mp-weixin`
- `build:mp-weixin`
- 如有 App 场景，可增加 `dev:app`、`build:app`

这部分属于宿主工程脚本配置，不属于 `jasper-login` 模块内部能力；模块本身只需要保证：

- 登录页面和登录流程可正常工作
- 宿主能通过安装配置注入正式服务
- 宿主能按自己的运行方式组织脚本和构建命令

#### 宿主通过配置注入 API

如果你不想直接改模块内部的 `services/auth-service.js`，可以在安装插件时注入自己的服务实现：

```js
import JasperLogin from "@/uni_modules/jasper-login";

app.use(JasperLogin, {
  pinia,
  services: {
    sms: {
      async sendSms(params) {
        return request.post("/api/sms/send", params);
      },
      async verifySms(params) {
        return request.post("/api/sms/verify", params);
      },
    },
    auth: {
      async loginByPhone(params) {
        return request.post("/api/auth/login-by-phone", params);
      },
      async loginByPassword(params) {
        return request.post("/api/auth/login-by-password", params);
      },
    },
    weixin: {
      async getPhoneInfoByCode(params) {
        return request.post("/api/weixin/phone", params);
      },
      async loginByWeixin(params) {
        return request.post("/api/weixin/login", params);
      },
    },
  },
});
```

要求：

- 函数名保持和模块约定一致
- 返回结构保持兼容：

```js
{
  code: 200,
  msg: "",
  data: {
    token: "",
    tokenExpired: "",
    userInfo: {},
    accountId: ""
  }
}
```

这样 `common/login-api.js` 会自动从注册中心读取宿主注入的实现，而不是继续走默认 mock 服务。

#### 账号密码登录接口协议

当前约定：

请求参数：

```js
{
  username: "",
  password: ""
}
```

响应结构：

```js
{
  code: 200,
  msg: "",
  data: {
    token: "",
    tokenExpired: "",
    accountId: "",
    userInfo: {
      nickname: "",
      avatar: ""
    }
  }
}
```

只要宿主接口能兼容这个结构，`login-withpwd.vue` 就不需要额外改动。

#### 登录成功 hooks 注入

当前模块也支持在安装时覆盖登录成功后的持久化行为：

```js
app.use(JasperLogin, {
  pinia,
  hooks: {
    persistToken(payload) {
      myTokenStore.set(payload.token, payload.tokenExpired);
    },
    persistUserInfo(payload, phoneNumber) {
      myUserStore.set({
        ...payload.userInfo,
        phone: phoneNumber,
      });
    },
    onLoginSuccess(payload, context) {
      console.log("登录成功", payload, context);
    },
  },
});
```

说明：

- 只覆盖 `persistToken` / `persistUserInfo` 即可，默认 `onLoginSuccess` 会自动调用当前生效的这两个 hook
- 如果宿主需要完全接管落库和副作用，也可以直接覆盖 `onLoginSuccess`
- 默认实现仍然会写入 `stores/user.js`

#### 生产接入边界

当前模块只负责：

- 登录页面 UI
- 登录流程编排
- 登录结果写入 `stores/user.js`
- 登录成功后的 redirect 跳转

当前模块不负责：

- 真实短信服务接入
- 真实账号密码登录接口
- 真实业务用户体系字段映射
- 宿主项目自己的权限体系和埋点

因此生产接入时，宿主项目至少要确认：

- 登录接口返回值能映射到 `token / tokenExpired / userInfo / accountId`
- 宿主项目已提供 `uni.$jasper` 或已调整 `utils/runtime-deps.js`
- 登录成功后的用户状态以 `stores/user.js` 为准，或自行接管这部分逻辑

## 接入前置条件

在接入前建议先确认：

1. 项目已安装并启用 Pinia
2. 项目已能访问 `uv-ui`、`jasper-ui`
3. 页面分包已按示例注册 `jasper-login` 的页面路径
4. 宿主已提供 `uni.$jasper` 或已自行改造 `utils/runtime-deps.js`
5. 生产项目已确认是否使用默认 mock 服务，或通过 install 注入真实服务

## `main.js` 完整注册登录组件

### 注册用默认Mock方法

```js
// #ifdef VUE3
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import uvUI from '@climblee/uv-ui';
import Request from '@/util/request/index';
import ConstantsPlugin from '@/common/plugins/constants';
import jasper from '@/uni_modules/jasper-ui';
import jasperLogin from '@/uni_modules/jasper-login';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();

  app.use(uvUI);
  app.use(jasper);
  app.use(pinia);
  app.use(Request);
  app.use(ConstantsPlugin);

  app.use(jasperLogin, { pinia, });

  return {
    app,
    Pinia,
  };
}
// #endif
```

### 最小接入示例见：

- [docs/examples/minimal-app-use.js](./docs/examples/minimal-app-use.js)

这个示例主要展示三件事：

1. 如何安装插件
2. 如何注入真实服务
3. 如何覆盖登录成功 hooks

## 平台差异说明

- `APP`
  - 支持一键登录 `univerify`
  - 可根据设备能力隐藏不支持的 provider
- `MP-WEIXIN`
  - 支持 `weixinMobile`
  - 通过 `getPhoneNumber` 获取微信手机号授权
- `H5`
  - 不支持 `univerify`
  - 登录后 redirect 仍按统一逻辑处理

## 示例与生产边界

以下能力默认更偏演示：

- `services/auth-service.js` 默认 mock 服务
- `docs/examples/sample-auth-api.js` 参考示例
- `docs/examples/minimal-app-use.js` 最小演示接入代码

以下能力可直接作为生产骨架：

- 页面结构
- 服务注册中心 `services/service-registry.js`
- 登录成功 hooks
- 配置三层结构
- `runtime-deps.js` 依赖收口方式

## 文件作用与使用方式

详细说明见：

- [架构说明](./docs/architecture.md)

#### 协议页面内容需要配置

协议页面内容需要配置成自己公司的

### 文档参考

[一键登录云对象使用说明文档](./uniCloud/cloudfunctions/uni-id-co/readme.md)
[微信开发者文档](./docs/weixin.md)
[架构说明](./docs/architecture.md)
[更新日志](./docs/changelog.md)

## 特殊功能组件详解

### login-withoutpwd 组件 back方法讲解

  在当前 uni_modules/jasper-login/pages/login/login-withoutpwd.vue:394 里，back() 不再只是单纯 uni.navigateBack()，而是
  先检查当前登录页 URL 上有没有 redirect：

  - 如果有 redirect，优先跳回目标页
  - redirectTo 失败时，再尝试 switchTab
  - 都不行才退回普通返回

  这样扩展的本意是解决两类场景：

  1. 路由守卫把未登录用户拦到登录页
     用户原本想去 /pages/xxx，登录完成后不能只是关闭登录页，而是应该回到原目标页。
  2. 目标页可能是 tabBar 页面
     navigateBack() 只能回栈，不能处理“我本来要去的是 tabBar”这种情况，所以补了 switchTab 兜底。

  不过当前这个写法还有个问题：redirectAfterLogin() 和 back() 都在处理回跳，职责有重复。
  也就是说，这次扩展的“目的”是合理的，但实现上有点冗余，后面更适合收敛成：

  - redirectAfterLogin()：只负责登录成功后的定向跳转
  - back()：只负责普通关闭当前页 navigateBack()

  这样职责会更清晰，也更不容易出错。
