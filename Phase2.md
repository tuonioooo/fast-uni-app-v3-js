

### Phase 2 — 请求层收敛（1天）

**2.1 统一接口返回规范**

目前存在两套响应码：`200`（业务接口）和 `0`（mock），需要统一：
```js
// 统一为
{ code: 200, msg: '', data: {} }
```

**2.2 修复响应拦截器悬空问题**

```js
// 现状（util/request/responseInterceptors.js）
return new Promise(() => { })  // ❌ 会导致调用方永远挂起

// 修改为
return Promise.reject(data)  // ✅ 明确 reject
```

**2.3 补全 token 注入**

```js
// requestInterceptors.js
if (config?.custom?.auth) {
    const token = uni.getStorageSync(uni.$jasper.getValue('tokenKey'))
    if (token) config.header['Authorization'] = `Bearer ${token}`
}
```

**2.4 补全 token 失效处理**

在响应拦截器里处理 `402` 状态码，跳转登录页。
