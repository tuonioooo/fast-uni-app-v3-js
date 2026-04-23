# uni-id-co

官网用于集成uni-id，提供一套完整的云函数能力，包括用户管理、权限管理、云端代码管理、云端数据库管理、一键登录、微信登录、第三方登录、短信登录等

官方文档：

[uni-id-pages介绍](https://doc.dcloud.net.cn/uniCloud/uni-id-pages.html)
[uniCloud云对象介绍](https://doc.dcloud.net.cn/uniCloud/cloud-obj.html)

### 依赖配置

如果使用一键登录功能, 需要集成如下云端组件：

1.在uni_modules 中集成 uni-config-center、uni-id-common两个云端组件 默认已经集成了。
2.在HBuilderX根目录中, 右键创建uniCloud云开发环境，创建成功后会默认将uni-config-center、uni-id-common、uni-id-co（一键登录云对象组件）整合到一起
3.在uni-config-center中配置好一键登录的配置信息

### 目录结构

注意：

这里仅保留了一键登录的功能，其他的功能全部删除了，如果有后续的需求，在新添加, 具体目录结构如下：

```text
├─common 					    // 公用逻辑
│  └─constants.js 			    // 移除 由于只使用一键登录，没有使用数据库这里定义的是数据库的相关的常量
│  └─error.js 			        // 保留
│  └─sensitive-aes-cipher.js    // 移除 未应用
│  └─universal.js 			    // 保留
│  └─validator.js 			    // 保留
├─config 					    // 配置 移除
│  └──utils.js 			        // 保留
│  └permission.js 			    // 移除
├─lang 						    // 国际化目录 保留
├─lib 						    // 基础功能，不建议修改此目录下文件
│  ├─third-party			    // 三方平台接口 保留
│  └─utils					    // 基础功能
│      └─ univerify.js 			// 只保留了univerify.js 一键登录功能 其余的都删除
├─middleware				// 中间件 只保留了validate.js 其余的功能没有用到全部都删了
└─module					// 分模块存放的云对象方法 只保留了login 模块 下的一键登录功能 其余的都删除掉
```

### 主要功能文件入口

* uni-id-co 云对象入口 `index.obj.js`
* 一键登录功能核心文件位置 
  * `lib/utils/univerify.js`
  * `module/login/login-by-univerify.js`


