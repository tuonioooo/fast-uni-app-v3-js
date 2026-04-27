# Mock 使用指南

## 核心思路

不同创建方式的项目，mock 能力有差异：

| 环境 | H5 开发模式 | App / 小程序 |
|---|---|---|
| **vue-cli 项目** | `vue-cli-plugin-mock`（webpack dev server 拦截） | ❌ 不支持拦截，走本地 callMock |
| **HBuilderX 项目** | `vite-plugin-mock`（Vite dev server 拦截） | ❌ 不支持拦截，走本地 callMock |

> **结论：** H5 开发模式下可以用插件拦截请求；App / 小程序环境下插件均不生效，统一通过 `api/sample.js` → `callMock()` 本地调用。

---

## 一、vue-cli 项目配置

### 安装依赖

```bash
pnpm add -D vue-cli-plugin-mock mockjs
```

### vue.config.js

当前项目在 [vite.config.js](/E:/dev_workspace/gitee/fast-template-org/fast-uni-app-v3-js/vite.config.js) 中启用了：

```js
// vue.config.js

export default defineConfig(() => {
  return {
    plugins: [
      uni(),
      viteMockServe({
        mockPath: 'mock/mock.js',           // 指向 mock 路由文件
        enable: env.VITE_USE_MOCK === 'on', // 根据环境变量开启 mock
      })
    ],
  }
}    

```

### mock/mock.js（vue-cli 格式）

vue-cli 的 mock 文件导出的是一个**函数**，接收 `app`（Express 实例）：

```js
// mock/mock.js
const { success, paginate, buildList } = require('./handler.js');

module.exports = function (app) {
  app.get('/api/query/list', (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const all = buildList(24);
    res.json(success(paginate(all, page, size)));
  });

  app.get('/api/query/cats', (req, res) => {
    res.json(success([
      { id: 1, title: '图片1', type: 'ALL' },
      { id: 2, title: '图片2', type: 'ALL' },
    ]));
  });
};
```

> ⚠️ `handler.js` 在 vue-cli 环境下需要使用 `module.exports` / `require` 语法（CommonJS），不能用 `export`。

---

## 二、HBuilderX 创建项目配置


### .env.development

```bash
VITE_USE_MOCK=on
```

### mock/mock.js（Vite 格式）直接使用callMock()自定义的格式

Vite 的 mock 文件导出的是一个**数组**：

```js
// mock/mock.js
import { success, paginate, buildList } from './handler.js';
import { catList, userInfo } from './data/index.js';

export default [
  {
    url: '/api/user',
    method: 'get',
    response: () => success(userInfo),
  },
  {
    url: '/api/query/cats',
    method: 'get',
    response: () => success(catList),
  },
  {
    url: '/api/query/list',
    method: 'get',
    timeout: 500,
    response: ({ query }) => {
      const { page = 1, size = 10, type = 0 } = query;
      return success(paginate(buildList(24, type), page, size));
    },
  },
];
```

---

## 三、App / 小程序：本地 callMock

App 和小程序环境下不存在 Vite / webpack dev server，插件拦截无效。  
统一通过 `mock/index.js` 提供的 `callMock` 函数直接在本地匹配并返回数据。

```
请求发出
  │
  ├── H5 开发模式  →  插件拦截（vite-plugin-mock / vue-cli-plugin-mock）
  │
  └── App / 小程序  →  callMock() 本地匹配 mock/mock.js 路由表
```

`callMock` 的路由表复用 `mock/mock.js`，两套环境共享同一份数据和逻辑，无需重复维护。

---

## 四、目录结构

```
mock/
├── data/
│   └── index.js     # 纯静态数据（newsList、catList、userInfo 等）
├── handler.js        # 公共工具函数（success、paginate、buildList）
├── mock.js           # 接口路由表（Vite 格式导出数组；vue-cli 需改为函数）
└── index.js          # callMock() 统一出口，供 App / 小程序调用

api/
└── sample.js         # 业务 API 层，页面统一从这里引入
```

---

## 五、业务调用方式

### 方式 1：H5 开发模式，插件自动拦截

```js
// 直接发请求，插件自动拦截返回 mock 数据
const res = await uni.$uv.http.get('/api/query/cats');
```

### 方式 2：通过 api/sample.js（推荐，全端通用）

```js
import { queryCats, queryList } from '@/api/sample';

const cats = await queryCats();
const list = await queryList({ page: 1, size: 10 });
```

### 方式 3：直接调用 callMock（底层调试用）

```js
import { callMock } from '@/mock/index.js';

const res = await callMock('/api/query/list', 'get', { page: 1, size: 10 });
```

---

## 六、注意事项

- 修改 `vite.config.js` 或 `vue.config.js` 后需要**重启开发服务**
- 修改 `.env.*` 中的 `VITE_USE_MOCK` 后也需要**重启**
- H5 下请求返回了 `index.html`：说明没有命中 mock，被 dev server 当成前端路由回退了，检查 `mock/mock.js` 中的 url 是否匹配
- vue-cli 项目的 `handler.js` / `data/index.js` 需使用 **CommonJS** 语法（`require` / `module.exports`），不能混用 ESM
- App / 小程序下 `mockjs` 的随机拦截语法（`Mock.mock('/api', ...)`）**不生效**，必须走 `callMock`