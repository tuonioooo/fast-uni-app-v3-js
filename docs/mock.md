# mock

### 安装依赖

```cmd
npm i -D vite-plugin-mock mockjs
```
or

```cmd
yarn add -D vite-plugin-mock mockjs
```

### vite配置

```typescript
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // 引入 svg 图标所需要的插件
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {viteMockServe} from "vite-plugin-mock";
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const env = loadEnv(mode, process.cwd()); //载入环境变量
    return {
        plugins: [
            uni(),
            viteMockServe({
                mockPath: 'mock', // mock文件存放的路径，默认是根目录下的mock文件夹
                enable: env.VITE_USE_MOCK === 'on'
            })
        ]
        // ...
    }
});

```

### api配置

```mock.ts
// mock/user.ts
import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/user',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          name: 'John Doe',
          age: 30
        }
      };
    },
  },
] as MockMethod[];

```

### 示例测试两种方式

* Fetch API
```typescript
// main.js or any component
fetch('/api/user')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // 处理数据
  })
  .catch(error => {
    console.error('Error fetching user:', error);
  });
```

* 使用 Axios
```typescript
// main.js or any component
import axios from 'axios';

axios.get('/api/user')
    .then(response => {
        console.log(response.data);
        // 处理数据
    })
    .catch(error => {
        console.error('Error fetching user:', error);
    });
```