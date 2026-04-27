# Husky + Commitlint + lint-staged 配置指南

## 概述

| 工具 | 作用 |
|---|---|
| **Husky** | 管理 Git 钩子（hooks） |
| **Commitlint** | 校验提交信息格式 |
| **lint-staged** | 仅对暂存文件执行 lint/格式化 |

---

## 一、安装依赖

```bash
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional lint-staged
```

---

## 二、初始化 Husky

```bash
npx husky init
```

执行后会：
- 在项目根目录创建 `.husky/` 目录
- 在 `package.json` 的 `scripts` 中自动添加 `"prepare": "husky"`

> `prepare` 脚本会在每次 `npm install` 后自动运行，确保团队成员安装依赖后钩子即刻生效，让 Git 知道"去 .husky/ 目录找钩子文件"，它相当于一次性的安装/注册动作，主要作用就是管理 Git 钩子（hooks/生命周期）

---

## 三、配置 Commitlint

在项目根目录创建 `commitlint.config.js`：

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

添加 `commit-msg` 钩子：

```bash
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

---

## 四、配置 lint-staged

在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{js,vue,ts}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,md,scss,css,html}": [
      "prettier --write"
    ]
  }
}
```

添加 `pre-commit` 钩子：

```bash
echo "npx lint-staged" > .husky/pre-commit
```

---

## 五、Commit Message 规范

格式：`<type>(<scope>): <subject>`

| type | 含义 |
|---|---|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建 / 工具 / 依赖变更 |
| `revert` | 回滚提交 |
| `ci` | CI 配置变更 |
| `build` | 构建系统变更 |

**示例：**

```
feat(auth): 新增微信手机号登录
fix(request): 修复响应拦截器悬空问题
docs: 更新接入说明
chore: 升级 eslint 到 9.x
```

---

## 六、完整 package.json 示例

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,vue,ts}": ["prettier --write", "eslint --fix"],
    "*.{json,md,scss,css,html}": ["prettier --write"]
  }
}
```

`.husky/` 目录结构：

```
.husky/
├── commit-msg    # 运行 commitlint
└── pre-commit    # 运行 lint-staged
```

---

## 七、工作流程

```
git commit
    │
    ├── pre-commit  →  lint-staged（格式化 + ESLint 暂存文件）
    │
    └── commit-msg  →  commitlint（校验提交信息格式）
```

若任意步骤失败，提交将被终止，确保只有规范的代码和提交信息进入仓库。