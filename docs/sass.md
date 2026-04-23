# Sass 新版语法使用 `@use` 和 `@forward` 替代 `@import`。

以下是迁移方案：

## **新语法对比**

### **旧语法（已弃用）**
```scss
@import '@climblee/uv-ui/theme.scss';
```

### **新语法（推荐）**
```scss
@use '@climblee/uv-ui/theme.scss' as *;
```

## **详细说明**

### **方案1：使用 `@use` 并导入所有内容**
```scss
// 导入所有变量和 mixin，可以直接使用
@use '@climblee/uv-ui/theme.scss' as *;

// 现在可以直接使用 theme.scss 中的变量
.container {
  color: $primary-color;
  @include flex-center;
}
```

### **方案2：使用命名空间**
```scss
// 使用默认命名空间（文件名）
@use '@climblee/uv-ui/theme.scss';

// 使用时需要加命名空间前缀
.container {
  color: theme.$primary-color;
  @include theme.flex-center;
}
```

### **方案3：自定义命名空间**
```scss
// 自定义命名空间为 'uv'
@use '@climblee/uv-ui/theme.scss' as uv;

// 使用自定义命名空间
.container {
  color: uv.$primary-color;
  @include uv.flex-center;
}
```

## **完整迁移示例**

### **迁移前**
```scss
// uni.scss
@import '@climblee/uv-ui/theme.scss';
@import './variables.scss';
@import './mixins.scss';

.page {
  background: $bg-color;
}
```

### **迁移后**
```scss
// uni.scss
@use '@climblee/uv-ui/theme.scss' as *;
@use './variables.scss' as *;
@use './mixins.scss' as *;

.page {
  background: $bg-color;
}
```

## **uni-app 中的配置**

在 `vue.config.js` 或 `vite.config.js` 中配置（如果需要）：

### **Vue CLI（vue.config.js）**
```js
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        // 旧版
        // additionalData: `@import "@climblee/uv-ui/theme.scss";`
        
        // 新版
        additionalData: `@use "@climblee/uv-ui/theme.scss" as *;`
      }
    }
  }
}
```

### **Vite（vite.config.js）**
```js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        // 旧版
        // additionalData: `@import "@climblee/uv-ui/theme.scss";`
        
        // 新版
        additionalData: `@use "@climblee/uv-ui/theme.scss" as *;`
      }
    }
  }
}
```

## **@use 与 @import 的关键区别**

| 特性 | @import | @use |
|------|---------|------|
| **作用域** | 全局作用域 | 文件作用域（需要命名空间） |
| **重复导入** | 会重复编译 | 只编译一次 |
| **变量覆盖** | 可能冲突 | 有命名空间隔离 |
| **性能** | 较慢 | 更快 |
| **推荐** | ❌ 已弃用 | ✅ 推荐使用 |

## **常见问题解决**

### **问题1：变量未定义**
```scss
// ❌ 错误
@use '@climblee/uv-ui/theme.scss';
.page {
  color: $primary-color; // 找不到变量
}

// ✅ 正确方式1：使用命名空间
@use '@climblee/uv-ui/theme.scss';
.page {
  color: theme.$primary-color;
}

// ✅ 正确方式2：使用 as *
@use '@climblee/uv-ui/theme.scss' as *;
.page {
  color: $primary-color;
}
```

### **问题2：多个文件导入**
```scss
// ✅ 每个文件都需要单独 @use
@use '@climblee/uv-ui/theme.scss' as *;
@use '@climblee/uv-ui/mixins.scss' as *;
@use '@climblee/uv-ui/variables.scss' as *;
```

## **自动迁移工具**

Sass 官方提供了自动迁移工具：

```bash
# 安装迁移工具
npm install -g sass-migrator

# 执行迁移
sass-migrator module --migrate-deps <你的scss文件路径>

# 示例
sass-migrator module --migrate-deps ./src/**/*.scss
```

## **推荐的最佳实践**

```scss
// uni.scss 或全局样式文件
@use '@climblee/uv-ui/theme.scss' as *;

// 这样在所有组件中都可以直接使用变量和 mixin
```

这样就完成了从 `@import` 到 `@use` 的迁移！✅