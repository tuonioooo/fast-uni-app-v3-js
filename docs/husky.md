# husky 


`commitlint.config.js` 文件是用来配置 **Commitlint** 的。**Commitlint** 是一个工具，用来确保提交信息遵循某种规范。它通常与 **Husky**（用于 Git 钩子）一起使用，以在每次提交时验证提交信息格式，帮助团队遵循统一的提交规范，提升代码历史的可读性和一致性。

### 是否需要配置 `commitlint.config.js`？

* **是的，通常需要配置**，尤其是在团队中需要遵循一致的提交信息规范时。它可以帮助保持项目提交历史的一致性，方便自动化工具（如生成 Changelog、发布版本等）处理提交记录。

### 常见的 Commitlint 配置

1. **默认配置：**
   如果你没有自定义配置，Commitlint 会使用默认规则，这通常是基于 **Conventional Commits** 规范。这个规范的主要规则如下：

   * 提交信息必须以 `type(scope?): subject` 的格式书写。
   * `type` 是固定的，比如 `feat`（新增功能）、`fix`（修复问题）等。
   * `scope` 是可选的，用来描述影响的范围（比如 `auth`）。
   * `subject` 是简短的提交描述。

   示例提交信息：

   ```text
   feat(auth): add login functionality
   fix(login): correct login button alignment
   ```

2. **自定义规则：**
   你可以通过 `commitlint.config.js` 自定义规则来改变提交信息的要求，比如：

   * 强制 `type` 为某些值（如 `feat` 或 `fix`）。
   * 设置 `subject` 的最大长度限制。
   * 定义 `scope` 是否可选等。

### 配置示例：

#### 1. 默认配置

如果你想使用默认的 `Conventional Commits` 规范，你可以在项目根目录下创建一个简单的 `commitlint.config.js` 文件：

```js id="bpo2vh"
module.exports = { extends: ['@commitlint/config-conventional'] };
```

这个配置就足够让 Commitlint 遵循默认的规范（如 `feat`, `fix` 等）。

#### 2. 自定义配置

你也可以根据需要自定义规则。例如，设置 `type` 必须为 `feat` 或 `fix`，并且 `subject` 最大长度为 50：

```js id="eqnm64"
module.exports = {
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix']],
    'subject-max-length': [2, 'always', 50],
  }
};
```

### 常见规则

* **`type-enum`**：定义提交信息中的 `type` 可以是哪些值。常见的 `type` 有：

  * `feat`：新功能
  * `fix`：修复问题
  * `docs`：文档更改
  * `style`：代码格式（不影响功能的更改）
  * `refactor`：重构代码
  * `test`：添加或修改测试
  * `chore`：日常事务性修改
  * 等等
* **`subject-case`**：控制 `subject` 的大小写，通常使用 `sentence-case` 或 `lower-case`。
* **`subject-empty`**：确保 `subject` 不为空。
* **`header-max-length`**：限制提交信息的最大字符数。

### 3. 与 Husky 配合使用

在开发中，`commitlint` 通常与 **Husky** 一起使用，以便在每次 Git 提交时自动验证提交信息。你可以设置一个 Git 钩子，确保在提交时进行检查。

**安装 Husky 和 Commitlint：**

```bash
npm install --save-dev husky @commitlint/config-conventional @commitlint/cli
```

然后，在 `package.json` 文件中设置 Git 钩子：

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

这样，每次提交时，Husky 会触发 Commitlint 来检查提交信息是否符合规范。

### 总结：

* **需要配置 `commitlint.config.js` 吗？**：如果你希望团队在提交信息时遵循一定的规范，尤其是对于自动化生成 changelog 或发布版本等场景，配置 `commitlint.config.js` 是推荐的。
* **常见的配置方式：**：你可以使用默认的 `@commitlint/config-conventional` 配置，或者自定义一些规则来更精确地控制提交信息的格式。



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