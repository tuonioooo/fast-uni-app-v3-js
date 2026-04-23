# jasper-login

### 介绍

登录页面组件，封装验证码登录、账号密码登录、其他第三方登录等

### 依赖配置

依赖uv-ui、jasper-ui组件库 、依赖uni-popup、uni-transition 

### 目录结构

```text
├─common                            //公共用文件
│  ├─login-argreements-mixin.js     //同意协议公共方法
│  ├─login-page.scss                //登录页面样式
│  └─sampleApi.js                   //登录相关的示例api接口           
├─components
│  ├─b-agreements                   //勾选协议组件
│  └─b-fab-login                    //三方登录组件含有（一键登录、三方登录调整处理逻辑）
├─pages
│  ├─agreements                     //协议页面,通过web-view跳转到/hybrid 中的协议页面
│  └─login                          //登录页面
│    └─login-smscode                //短信验证码输入页
│    └─login-withoutpwd             //登录页面不需要密码的总入口（一键登录、三方登录都走这里）
│    └─login-withpwd                //用户名、密码登录页
├─static                            //静态资源、设计到三方登录的图片
│  ├─app-plus
│  │  └─jasper-fab-login
│  ├─limeClipper
│  └─login
│      └─jasper-fab-login
├─stores                            //状态管理 这里用到的是Vuex用于保存用户的登录信息, 主要是兼容vue2
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

1.用于配置哪些登录方式需要开启,根据顺序来启动对应的登录方式  
2.配置微信相关的appid  
3.配置hybrid协议页面路径  

> * 配置 hybrid 文件夹, 用于保存隐私协议相关的页面, 这里主要是用于web-view调整到这里本地的页面  
>   * 如果用HBuilderX创建的项目,需要在根目录中配置 hybrid 文件夹  
>   * 如果用vue-cli 需要在src目录中 配置hybrid 文件夹  

具体内容如下：

```js
export default {
	//调试模式
	"debug": false,
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
		"serviceUrl": "/uni_modules/jasper-login/pages/agreements/agreement?needNav=1", //用户服务协议链接
		"privacyUrl": "/uni_modules/jasper-login/pages/agreements/privacy?needNav=1", //隐私政策条款链接
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

#### sampleApi示例接口

sampleApi.js 是一个示例api,需要替换成真实的接口

#### 协议页面内容需要配置

协议页面内容需要配置成自己公司的

### 文档参考

[一键登录云对象使用说明文档](./uniCloud/cloudfunctions/uni-id-co/readme.md)
[微信开发者文档](./weixin.md)