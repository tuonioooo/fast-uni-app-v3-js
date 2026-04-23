
# Phase 1 工程基础 — 接入指南

## 1. 替换 / 新增文件

将本目录下所有文件复制到项目根目录，**覆盖同名文件**：

```
.editorconfig         ← 新增
.env.example          ← 新增
.eslintignore         ← 新增
.eslintrc.js          ← 新增
.gitignore            ← 覆盖（补全了更多忽略项）
.husky/
  commit-msg          ← 新增
  pre-commit          ← 新增
.prettierignore       ← 新增
.prettierrc           ← 新增
commitlint.config.js  ← 新增
package.json          ← 覆盖（新增脚本 + 新增 devDependencies）
```

---

## 2. 安装新增依赖

```bash
pnpm install
```

新增的 devDependencies：

| 包 | 用途 |
|---|---|
| `eslint` | 代码质量检查 |
| `eslint-plugin-vue` | Vue 文件 lint 支持 |
| `prettier` | 代码格式化 |
| `husky` | Git hooks 管理 |
| `lint-staged` | 只检查暂存文件 |
| `@commitlint/cli` | commit message 校验 |
| `@commitlint/config-conventional` | 约定式提交规范 |

---

## 3. 初始化 Husky

```bash
# 初始化 husky（生成 .husky/_/husky.sh）
pnpm prepare

# 给 hook 文件添加可执行权限（Linux/Mac）
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

> Windows 用户无需执行 chmod，Git Bash 下会自动处理。

---

## 4. 验证配置

### 4.1 验证 ESLint

```bash
pnpm lint
```

预期：扫描 `.js` / `.vue` 文件，输出 warning/error 列表（忽略 uni_modules 三方库）。

### 4.2 验证 Prettier

```bash
pnpm format:check
```

预期：检查格式是否符合规范，有差异会列出文件。

```bash
pnpm format
```

一键格式化所有文件。

### 4.3 验证 commit-msg 校验

```bash
# 模拟一条不规范的提交（会被拦截）
echo "随便写的" | npx commitlint

# 模拟一条规范的提交（通过）
echo "feat: 新增用户登录功能" | npx commitlint
```

### 4.4 验证 lint-staged

```bash
# 暂存一个文件后提交，会自动触发 lint-staged
git add pages/index/index.vue
git commit -m "chore: 测试 lint-staged"
```

---

## 5. 可用脚本说明

| 命令 | 说明 |
|---|---|
| `pnpm dev:h5` | H5 开发模式 |
| `pnpm dev:mp-weixin` | 微信小程序开发模式 |
| `pnpm dev:app` | App 开发模式 |
| `pnpm build:h5` | H5 生产构建 |
| `pnpm build:mp-weixin` | 微信小程序生产构建 |
| `pnpm build:app` | App 生产构建 |
| `pnpm lint` | 检查代码规范 |
| `pnpm lint:fix` | 自动修复可修复的问题 |
| `pnpm format` | 格式化所有文件 |
| `pnpm format:check` | 检查格式是否符合规范 |

> `dev:*` 和 `build:*` 命令依赖 HBuilderX 内置的 `uni` CLI 或 `@dcloudio/vite-plugin-uni`，
> 如果是 HBuilderX 可视化操作为主的项目，这些脚本作为补充参考即可。

---

## 6. Commit Message 规范

格式：`<type>(<scope>): <subject>`

| type | 含义 |
|---|---|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `chore` | 构建/工具/依赖变更 |
| `revert` | 回滚 |
| `ci` | CI 配置 |
| `build` | 构建系统 |

示例：
```
feat(login): 新增微信手机号登录方式
fix(request): 修复响应拦截器悬空问题
docs: 更新 Phase1 接入说明
chore: 升级 eslint 到 8.x
```

---

## 7. 后续注意事项

1. **`.env.local` 不要提交**：已在 `.gitignore` 中忽略，每位开发者本地复制 `.env.example` 自行填写。
2. **uni_modules 三方库不做 lint**：已在 `.eslintignore` 和 `.prettierignore` 中排除。
3. **首次 format 会改很多文件**：建议单独一个 commit 提交格式化结果，与功能代码分开，方便 code review。