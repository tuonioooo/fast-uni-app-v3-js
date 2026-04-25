---
name: ui-prototype-to-page
description: |
  将外部 UI 原型（Figma 截图、静态 HTML、其他框架页面、设计稿图片等）转换为适配当前
  uni-app + Vue 3 + dart-sass（**`<style lang="scss">`** 标签，SCSS 花括号语法）脚手架的页面代码，结合项目已有的 uni-ui、uv-ui、jasper-ui、
  jasper-login 组件库及样式规范，输出可直接运行的页面/组件代码。

  触发时机（满足任意一条即应使用此 Skill）：
  - 用户上传了 UI 截图、Figma 导出图、设计稿，要求转为项目代码
  - 用户提供了其他框架的 HTML/JSX/Vue 代码，要求迁移到 uni-app
  - 用户说"按这个原型写页面"、"参考这个设计实现"、"把这个转成我们项目的代码"
  - 用户要求新建 uni-app 页面并提供了视觉参考
  - 用户提到原型/设计稿/截图/UI 图 + 要实现/转换/写代码
---

# UI 原型 → uni-app 页面转换 Skill

## 技术栈概览

| 维度 | 技术选型 |
|------|----------|
| 框架 | uni-app + Vue 3 Composition API |
| 构建 | Vite |
| 样式 | dart-sass，`<style lang="scss">` SCSS 花括号语法 |
| 组件库 | uni-ui · uv-ui · jasper-ui · jasper-login |
| 目标平台 | 微信小程序 / H5 / App（跨端） |

---

## 第一步：信息收集

开始写代码之前，先确认以下信息（用户没提供则主动询问）：

### 必须确认
1. **目标页面类型**：列表页 / 表单页 / 详情页 / 登录页 / 首页 / 弹窗组件？
2. **主要目标平台**：微信小程序 / H5 / 通用跨端？（影响某些组件的选择）
3. **原型形式**：图片截图 / Figma 图 / HTML 代码 / 其他框架 Vue/React 代码？

### 推荐提供（显著提升代码质量）
- 项目 SCSS 变量文件（`variables.scss` 或 `uni.scss`）
- 已有页面文件（作为代码风格参考）
- `pages.json` 中相关页面的配置片段
- 项目的公共组件目录结构

> 💡 **提示**：把 `uni.scss`、一个已有页面的 `.vue` 文件贴进来，Claude 会自动识别并复用你的变量和风格。

---

## 第二步：原型解析

拿到原型后，先分析再写代码，输出一份简短的解析摘要：

### 2.1 布局结构识别

```
uni-app 常见布局模式：
- 顶部导航栏（navigationBar / 自定义 nav）
- 滚动主体区域（scroll-view 或普通 view）
- 底部固定操作栏（fixed bottom）
- TabBar 页面
- 弹出层（popup / modal）
```

### 2.2 组件映射表

将原型中的 UI 元素映射到项目组件库，**优先级从高到低**：

#### jasper-ui（项目私有，最优先）
> 用于项目定制化的业务组件，如有对应组件应第一优先使用。
```
使用前确认：询问用户 jasper-ui 包含哪些组件，或让用户提供组件清单。
常见可能有：JasperNavBar、JasperTabBar、JasperCard、JasperList 等业务组件
```

#### jasper-login（登录认证相关，次优先）
```
适用场景：登录页、注册页、手机号验证、微信授权
组件可能包含：LoginForm、PhoneInput、VerifyCode、WechatAuth 等
```

#### uv-ui（通用 UI，第三优先）
| 原型元素 | uv-ui 组件 |
|---------|-----------|
| 弹出层/底部弹窗 | `<uv-popup>` |
| 轮播图 | `<uv-swiper>` |
| 下拉刷新+上拉加载 | `<uv-list>` + `<uv-loadmore>` |
| 导航栏（自定义） | `<uv-navbar>` |
| 标签页 | `<uv-tabs>` |
| 搜索框 | `<uv-search>` |
| 单元格列表 | `<uv-cell>` / `<uv-cell-group>` |
| 按钮 | `<uv-button>` |
| 图片 | `<uv-image>` |
| 图标 | `<uv-icon>` |
| 加载状态 | `<uv-loading-icon>` |
| 空状态 | `<uv-empty>` |
| Toast / 提示 | `uni.showToast()` 或 `<uv-toast>` |
| 确认弹窗 | `<uv-modal>` |
| 表单 | `<uv-form>` + `<uv-form-item>` |
| 输入框 | `<uv-input>` |
| 单选/多选 | `<uv-radio>` / `<uv-checkbox>` |
| 数字步进器 | `<uv-number-box>` |
| 评分 | `<uv-rate>` |
| 上传图片 | `<uv-upload>` |
| 进度条 | `<uv-line-progress>` |
| 标签/徽章 | `<uv-tag>` / `<uv-badge>` |
| 骨架屏 | `<uv-skeleton>` |
| 步骤条 | `<uv-steps>` |
| 时间线 | `<uv-timeline>` |

#### uni-ui（uni 官方组件，补充使用）
| 原型元素 | uni-ui 组件 |
|---------|-----------|
| 图标 | `<uni-icons>` |
| 日历/日期 | `<uni-calendar>` / `<uni-datetime-picker>` |
| 倒计时 | `<uni-countdown>` |
| 折叠面板 | `<uni-collapse>` |
| 通知栏 | `<uni-notice-bar>` |
| 分段器 | `<uni-segmented-control>` |

#### uni-app 原生组件（最后兜底）
```
<view> <text> <image> <scroll-view> <swiper>
<input> <textarea> <button> <picker>
<map> <video> <canvas>
```

### 2.3 跨端兼容性检查

分析原型时，标注以下风险项：

```
⚠️  小程序限制：
- 不支持 DOM/BOM 操作
- CSS 选择器有限制（不支持 * 选择器、属性选择器等）
- 本地图片路径需注意（小程序只支持网络图片或 base64）
- 不支持 <a> 标签跳转，使用 navigator 或 uni.navigateTo

⚠️  H5 适配：
- 注意 1rpx 在 H5 的显示（可能过细）
- 安全区域（iPhone 刘海屏底部）需单独处理
```

### 2.4 交互行为梳理

```
列出需要实现的交互：
□ 页面跳转方式（navigateTo / redirectTo / switchTab）
□ 数据加载（onLoad / onShow / 下拉刷新 / 上拉加载）
□ 表单提交与校验
□ 弹窗/popup 的开关逻辑
□ 条件渲染（登录态判断、权限控制）
□ 分享配置（onShareAppMessage）
```

---

## 第三步：代码规范

### 3.1 文件结构

```
src/
├── pages/
│   └── [模块名]/
│       └── index.vue          # 页面文件
├── components/                # 公共组件
│   └── [ComponentName]/
│       └── index.vue
├── composables/               # 组合式函数
│   └── use[Feature].ts
├── api/                       # 接口请求
│   └── [module].ts
└── styles/
    ├── uni.scss               # 全局变量（uni-app 自动注入）
    └── common.scss            # 公共样式
```

**pages.json 中注册新页面：**
```json
{
  "pages": [
    {
      "path": "pages/模块名/index",
      "style": {
        "navigationBarTitleText": "页面标题",
        "navigationBarBackgroundColor": "#FFFFFF",
        "navigationBarTextStyle": "black",
        "backgroundColor": "#F5F5F5"
      }
    }
  ]
}
```

### 3.2 标准页面模板

```vue
<template>
  <!-- uni-app 根节点用 view，不用 div -->
  <view class="page">

    <!-- 自定义导航栏（如需要） -->
    <uv-navbar title="页面标题" :placeholder="true" />

    <!-- 主体内容区，需要滚动时用 scroll-view -->
    <scroll-view
      class="page-body"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 内容区块 -->
      <view class="section">
        <!-- ... -->
      </view>

      <!-- 加载更多 -->
      <uv-loadmore :status="loadStatus" />

    </scroll-view>

    <!-- 底部固定操作栏 -->
    <view class="page-footer safe-area-bottom">
      <uv-button type="primary" text="提交" @click="handleSubmit" />
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import { onShow, onShareAppMessage } from '@dcloudio/uni-app'

// ---- 类型定义 ----
interface ListItem {
  id: number
  title: string
}

// ---- 响应式状态 ----
const list = ref<ListItem[]>([])
const loading = ref(false)
const refreshing = ref(false)
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore')
const page = ref(1)
const PAGE_SIZE = 10

// ---- 数据请求 ----
const fetchData = async (isRefresh = false) => {
  if (isRefresh) { page.value = 1; list.value = [] }
  loading.value = true
  try {
    // const res = await getListApi({ page: page.value, pageSize: PAGE_SIZE })
    // list.value = isRefresh ? res.data : [...list.value, ...res.data]
    // loadStatus.value = res.data.length < PAGE_SIZE ? 'nomore' : 'loadmore'
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onRefresh = () => { refreshing.value = true; fetchData(true) }
const loadMore = () => { if (loadStatus.value !== 'nomore') { page.value++; fetchData() } }
const handleSubmit = async () => { /* 表单校验 + 接口调用 */ }

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
// uni.scss 变量会自动注入，无需 @import
.page {
  min-height: 100vh;
  background-color: $uni-bg-color-grey;

  &-body {
    height: calc(100vh - #{$nav-height} - #{$footer-height});
  }

  &-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16rpx 32rpx;
    background: #fff;
    box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  }
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.section {
  margin: 24rpx;
  border-radius: 16rpx;
  background: #fff;
  padding: 32rpx;
}
</style>
```

### 3.3 SCSS 规范（dart-sass，`lang="scss"`）

```scss
// ✅ 使用 rpx 单位（750px 设计稿：1px = 2rpx）
padding: 24rpx 32rpx;
border-radius: 16rpx;
font-size: 28rpx;

// ✅ 使用项目变量或 uni 内置变量，不硬编码颜色
color: $uni-color-primary;
background: $uni-bg-color-grey;
border-color: $uni-border-color;

// ✅ 嵌套与 mixin 示例
.card {
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  background: #fff;

  &__title {
    font-size: 32rpx;
    color: $uni-text-color;
    font-weight: 600;
  }

  &__desc {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
  }
}

// ❌ 避免
color: #007AFF;      // 硬编码颜色
font-size: 14px;     // 避免 px（边框 1px 除外）

// uni-app 内置 SCSS 变量速查（uni.scss 自动注入，可直接使用）
// $uni-color-primary / success / warning / error
// $uni-text-color / $uni-text-color-grey
// $uni-bg-color-grey（页面背景）
// $uni-border-color
// $uni-font-size-sm / base / lg
```

**`<style>` 标签声明：**
```vue
<style lang="scss" scoped>
</style>
```

### 3.4 常见场景片段

**列表 + 搜索**
```vue
<uv-search v-model="keyword" placeholder="搜索" @search="onSearch" @clear="() => fetchData(true)" />
<uv-cell-group>
  <uv-cell v-for="item in list" :key="item.id" :title="item.title" is-link @click="toDetail(item.id)" />
</uv-cell-group>
```

**表单页**
```vue
<uv-form ref="formRef" :model="form" :rules="rules">
  <uv-form-item label="姓名" prop="name" labelWidth="160rpx">
    <uv-input v-model="form.name" placeholder="请输入姓名" border="none" />
  </uv-form-item>
  <uv-form-item label="手机号" prop="phone" labelWidth="160rpx">
    <uv-input v-model="form.phone" type="number" maxlength="11" border="none" />
  </uv-form-item>
</uv-form>
```

**底部弹出层**
```vue
<uv-popup ref="popupRef" mode="bottom" :round="16">
  <view class="popup-inner">
    <!-- 弹窗内容 -->
    <uv-button text="确认" @click="popupRef.close()" />
  </view>
</uv-popup>
<uv-button text="打开" @click="popupRef.open()" />
```

**登录页（jasper-login）**
```vue
<!-- 具体组件名以项目实际为准，需用户提供 -->
<!-- <jasper-login @success="onLoginSuccess" /> -->
```

---

## 第四步：标准输出格式

每次转换按以下顺序输出：

**① 解析摘要**
```
📐 布局：顶部搜索 + 可滚动列表 + 底部固定按钮
🧩 组件：uv-navbar / uv-search / uv-cell-group / uv-loadmore / uv-button
🎨 样式：dart-sass，`lang="scss"` + rpx，复用 $uni-color-primary 等变量
📁 文件：pages/product/index.vue
⚠️  注意：底部安全区已处理
```

**② 主页面完整代码**（关键处附注释说明选型原因）

**③ 子组件文件**（如需拆分弹窗、复杂卡片等）

**④ pages.json 配置片段**

**⑤ TODO 清单**
- [ ] 替换 API 函数为实际接口
- [ ] 确认 jasper-ui / jasper-login 实际组件名
- [ ] 在 `pages.json` 注册新页面
- [ ] 补充接口返回数据的 TypeScript 类型

---

## 第五步：自检清单

生成代码前逐项确认：

- [ ] 根节点用 `<view>`，文字用 `<text>`，无 `<div>` / `<span>`
- [ ] 单位用 `rpx`，无直接 `px`（边框 `1px` 除外）
- [ ] 无硬编码颜色，使用 SCSS 变量或 `$uni-*` 变量
- [ ] `<style>` 标签使用 `lang="scss" scoped`
- [ ] 图片用 `<uv-image>` 或 `<image>`，设置了 `mode` 属性
- [ ] `v-for` 列表都有 `:key`
- [ ] 有 loading / 空状态 / 错误状态处理
- [ ] 底部固定区域处理了 iOS 安全区域
- [ ] 已提供 `pages.json` 配置片段
- [ ] 跨端不兼容 API 已加注释说明

---

## 附录：使用建议

> 为获得最贴合项目的代码，建议在提供原型时一并附上：
> 1. `uni.scss` 或项目 `variables.scss` 中的变量列表
> 2. jasper-ui / jasper-login 的组件名清单（或一个使用示例）
> 3. 一个已有页面的 `.vue` 文件作为风格参考（尤其是 `<style lang="scss">` 部分）
> 4. API 请求函数的封装示例
>
> 提供越多上下文，生成代码越能直接投入使用。