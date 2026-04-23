# jasper-ui

简介： jasper-ui 组件名称 命名由来：美国统一螺纹粗牙螺纹：在机械领域，UNC代表美国统一螺纹 相当于一种组件的存在。

扩展组件结构整体依赖如下：

```
jasper-ui
│      ├─css
│      │  ├─demand
│      │  └─global
│      ├─libs
│      │  ├─config
│      │  ├─function
│      │  │  ├─helpers
│      │  │  │  └─src
│      │  │  ├─object
│      │  │  │  └─src
│      │  │  ├─renderjs
│      │  │  └─validate
│      │  │      └─src
│      │  └─mixins
│      │  ├─hooks
│      └─static
```

### css

* demand: 按需引入
* global: 全局样式

全局样式入口文件是： `index.scss`

主题文件是：`theme.scss`

### libs

常用函数库

| 名称                                        | 描述                                  |  
|-------------------------------------------|-------------------------------------|  
| album.js                                  | 处理相册或图片集合的相关功能，如上传、下载、预览等。          |  
| auth.js                                   | 提供认证相关的功能，如用户登录、权限验证等。              |  
| base64.js                                 | 用于Base64编码和解码的工具库。                  |  
| color.js                                  | 色彩处理工具，支持颜色转换、对比、生成等。               |  
| colorGradient.js                          | 创建和应用颜色渐变效果的工具库。                    |  
| device.js                                 | 检测和获取设备信息的工具库，如屏幕尺寸、操作系统等。          |  
| file-cache.js                             | 文件缓存机制的实现，用于加速文件访问。                 |  
| file-sizeof.js                            | 获取文件或数据大小的工具库。                      |  
| guid.js                                   | 生成全局唯一标识符（GUID）的工具库。                |  
| hump.js                                   | 字符串驼峰命名与下划线命名互转的工具库。                |  
| index.js                                  | 通常是项目的入口文件或模块集合的索引。                 |  
| json.js                                   | 提供JSON处理的功能，如解析、序列化等。               |  
| math.js                                   | 数学运算工具库，包含常见的数学函数和算法。               |  
| pageRoute.js                              | 页面路由管理工具，用于前端路由的管理和跳转。              |  
| queryParams.js                            | 解析URL查询参数的工具库。                      |  
| queryParams2.js                           | 另一个解析URL查询参数的库，可能是为了解决兼容性问题或提供更多功能。 |  
| random.js                                 | 生成随机数的工具库，支持多种随机算法。                 |  
| screen.js                                 | 屏幕信息获取工具，如屏幕分辨率、方向等。                |  
| str.js                                    | 字符串处理工具库，包含字符串的格式化、拼接、搜索等功能。        |  
| styleUtil.js                              | 样式处理工具库，可能包含动态样式生成、样式转换等功能。         |  
| time.js                                   | 时间处理工具库，提供日期格式化、时间计算等功能。            |  
| trim.js                                   | 字符串去空白（如空格、换行符等）的工具库。               |  
| uniNav.js                                 | 可能是为某个特定框架（如UniApp）提供的导航工具库。        |  
| uniPromise.js                             | 封装或增强Promise功能的库，针对UniApp或其他框架做了优化。 |  
| uuid.js                                   | 生成通用唯一识别码（UUID）的工具库。                |
| swiper-resistance.js,keyboard-listener.js | 用于处理官方uni-app 官方swiper左右回弹的问题       |
| parser.js,type.js,type-idcard.js          | 校验函数用于基本的正则校验                       |
| array.js,object.js                        | 数组合并、对象校验、深度合并                      |

### 相关文档

[mixins公共混入组件](./document/mixins.md)
[hooks](./document/hooks.md)
[renderJS](./document/renderjs.md)
[更新日志](./document/changelog/changelog.md)


