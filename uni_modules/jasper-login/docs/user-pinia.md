# 用户 `userStore` 注入`pinia` 过程详解

## `getUserStore()` 方法解析

### 核心原理

`useUserStore()` 本质是 Pinia 提供的 store 工厂函数，它有两种调用方式：

```javascript
useUserStore()        // 无参 —— 自动查找当前激活的 Pinia 实例
useUserStore(pinia)   // 有参 —— 显式指定使用哪个 Pinia 实例
```

---

### 两种情况的区别

**无参调用（组件内）**
```javascript
// Vue 组件内部调用
useUserStore()
```
Pinia 内部通过 `getCurrentInstance()` 拿到当前 Vue 组件实例，再从组件实例上找到已挂载的 Pinia，**前提是必须在组件上下文中调用**。

---

**有参调用（组件外）**
```javascript
// 脱离组件上下文，比如在独立 JS 模块中调用
useUserStore(pinia)
```
没有组件实例，Pinia 无法自动感知，所以需要**显式传入 Pinia 实例**来告诉它用哪个。

---

### 为什么这个注册中心需要这样设计

```javascript
// 注册中心是一个独立 JS 模块，不在任何 Vue 组件内
// 它可能在以下场景被调用：

// 场景1：被组件内的 hooks 调用 ——「有组件上下文」
//   → useUserStore() 无参即可

// 场景2：被请求拦截器、初始化脚本调用 ——「无组件上下文」
//   → useUserStore() 会报错，必须传 pinia
```

所以这个方法做了一个**兜底保护**：

```javascript
function getUserStore() {
  return registry.context.pinia
    ? useUserStore(registry.context.pinia)  // 宿主注入了 pinia → 安全调用
    : useUserStore()                         // 未注入 → 依赖组件上下文（有风险）
}
```

---

### 宿主正确的使用姿势

```javascript
// main.js
import { createPinia } from 'pinia'
import { setupJasperLoginRegistry } from 'jasper-login'

const pinia = createPinia()
app.use(pinia)

// 把 pinia 实例注入注册中心，确保组件外也能安全调用
setupJasperLoginRegistry({
  pinia,  // ← 关键
  services: { ... }
})
```

---

### 原理

```javascript
// 你写的
export const useUserStore = defineStore('jasper-user', () => { ... })

// defineStore 返回的 useUserStore 函数，Pinia 内部签名实际是：
function useUserStore(pinia?: Pinia) {
  // 有传 pinia → 用传入的
  // 没传     → 用 getCurrentInstance() 找当前组件上的 pinia
}
```

`defineStore` 在生成 `useUserStore` 时，**自动注入了接收 pinia 参数的能力**，这是 Pinia 框架层面封装好的，不需要你在 store 代码里手动写。

---

### 对应到注册中心的调用

```javascript
// registry.js
function getUserStore() {
  // pinia 实例是宿主通过 setupJasperLoginRegistry({ pinia }) 注入进来的
  return registry.context.pinia
    ? useUserStore(registry.context.pinia)  // Pinia 内部处理这个参数
    : useUserStore()
}
```

所以整个流程是：

```
宿主 main.js
  → setupJasperLoginRegistry({ pinia })   // 把 pinia 存入 registry
      → registry.context.pinia = pinia

注册中心内部调用
  → getUserStore()
      → useUserStore(registry.context.pinia)  // 透传给 Pinia 内部
          → Pinia 内部用这个实例找到对应的 store
```

你的 `user.js` 不需要改，**接收 pinia 参数这件事由 `defineStore` 生成的函数负责**，对你完全透明。

### 总结

| | 无参 `useUserStore()` | 有参 `useUserStore(pinia)` |
|---|---|---|
| 适用场景 | Vue 组件内 / `<script setup>` | 组件外的独立 JS 模块 |
| 查找 Pinia | 自动从当前组件实例获取 | 使用显式传入的实例 |
| 风险 | 组件外调用会报错 | 需要宿主在初始化时注入 |