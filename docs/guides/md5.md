# crypto-js 与 MD5

当前项目不再使用 `js-md5`，而是统一使用 `crypto-js`。这样可以和项目内现有的 AES、DES 能力保持一致，也更适合 uni-app / 小程序场景。

## 安装

本项目已经安装：

```bash
pnpm add crypto-js
```

如果是手动补依赖，也可以使用：

```bash
npm install crypto-js
```

## MD5 用法

```js
import CryptoJS from 'crypto-js';

const md5_1 = CryptoJS.MD5('').toString();
const md5_2 = CryptoJS.MD5('The quick brown fox jumps over the lazy dog').toString();
const md5_3 = CryptoJS.MD5('中文').toString();

console.log(md5_1); // d41d8cd98f00b204e9800998ecf8427e
console.log(md5_2); // 9e107d9d372bb6826bd81d3542a419d6
console.log(md5_3); // a7bac2239fcdcb3a067903d8077c4a07
```

## 项目中的使用建议

- 只需要做字符串摘要时，直接使用 `CryptoJS.MD5(content).toString()`
- 需要做对称加解密时，优先使用项目已封装好的 `jasper-ui` 方法
- 当前项目根依赖里只有 `crypto-js`，不要再额外引入 `js-md5`

## AES / DES

项目已经在 [uni_modules/jasper-ui/libs/function/helpers/src/cryptoUtil.js](../uni_modules/jasper-ui/libs/function/helpers/src/cryptoUtil.js) 中封装了以下方法：

- `encryptAES(content, key, iv)`
- `decryptAES(content, key, iv)`
- `encryptDES(content, key)`
- `decryptDES(content, key)`

安装 `jasper-ui` 插件后，可以通过 `uni.$jasper` 直接调用：

```js
const encrypted = uni.$jasper.encryptAES('12345678', '12345678', '12345678');
const decrypted = uni.$jasper.decryptAES(encrypted, '12345678', '12345678');
```

页面示例可参考 [pages/index/index.vue](../pages/index/index.vue)。

## 注意事项

- `MD5` 是摘要算法，不可逆，不等同于加密
- 涉及前后端联调时，`key`、`iv`、编码方式、填充模式必须和后端保持一致
- 如果只是为了接口签名，通常使用 `MD5` 即可；如果需要传输敏感内容，再考虑 `AES`
