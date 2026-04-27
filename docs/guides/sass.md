# Sass / SCSS 使用指南

## 两种语法对比

Sass 提供两种语法风格，可根据偏好选择：

| 特性 | `.sass` | `.scss` |
|------|---------|---------|
| 语法风格 | 缩进式，无大括号和分号 | 类 CSS，有大括号和分号 |
| 学习成本 | 对缩进敏感，易出错 | 接近原生 CSS，易上手 |
| 社区支持 | 一般 | 广泛 ✅ |

**推荐使用 `.scss`**，尤其在 uni-app 项目中，与官方组件和第三方库兼容性更好。

```sass
// .sass 风格
$color: red
body
  color: $color
```

```scss
// .scss 风格
$color: red;
body {
  color: $color;
}
```

---

## uni-app 中的 Sass

uni-app 默认使用 **dart-sass** 作为编译器，同时支持 `.sass` 和 `.scss` 两种语法，Vite 会自动识别。

---

## `@use` 替代 `@import`

Sass 新版已弃用 `@import`，推荐使用 `@use` / `@forward`。

### 对比

| 特性 | `@import` ❌ | `@use` ✅ |
|------|------------|---------|
| 作用域 | 全局，易污染 | 文件级，有命名空间隔离 |
| 重复导入 | 会重复编译 | 只编译一次 |
| 变量冲突 | 可能冲突 | 命名空间隔离 |
| 状态 | 已弃用 | 推荐使用 |

### 三种引入方式

```scss
// 方式一：导入所有内容（最常用）
@use '@climblee/uv-ui/theme.scss' as *;
.container { color: $primary-color; }

// 方式二：使用默认命名空间
@use '@climblee/uv-ui/theme.scss';
.container { color: theme.$primary-color; }

// 方式三：自定义命名空间
@use '@climblee/uv-ui/theme.scss' as uv;
.container { color: uv.$primary-color; }
```

### 迁移示例

```scss
// 迁移前
@import '@climblee/uv-ui/theme.scss';
@import './variables.scss';

// 迁移后
@use '@climblee/uv-ui/theme.scss' as *;
@use './variables.scss' as *;
```

---

## uni-app 项目配置

### Vite（vite.config.js）

```js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@climblee/uv-ui/theme.scss" as *;`
      }
    }
  }
}
```

### Vue CLI（vue.config.js）

```js
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@use "@climblee/uv-ui/theme.scss" as *;`
      }
    }
  }
}
```

---

## 常见问题

**变量找不到？** 忘记加 `as *` 时需要带命名空间前缀：

```scss
// ❌ 报错
@use '@climblee/uv-ui/theme.scss';
color: $primary-color;

// ✅ 加命名空间
color: theme.$primary-color;

// ✅ 或用 as *
@use '@climblee/uv-ui/theme.scss' as *;
color: $primary-color;
```

**多文件引入？** 每个文件需单独 `@use`：

```scss
@use '@climblee/uv-ui/theme.scss' as *;
@use '@climblee/uv-ui/mixins.scss' as *;
```

---

## 自动迁移工具

```bash
npm install -g sass-migrator
sass-migrator module --migrate-deps ./src/**/*.scss
```