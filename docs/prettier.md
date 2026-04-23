# .prettierrc 配置文件说明

`.prettierrc` 是 [Prettier](https://prettier.io/docs/) 的格式化规则配置文件，支持 JSON、YAML、JS 三种格式，用于统一团队代码风格。

---

## 常用配置项

### `printWidth` — 每行最大字符数

超出该长度时自动换行，默认值为 `80`。

```json
{ "printWidth": 80 }
```

### `tabWidth` — 缩进空格数

每级缩进使用的空格数，默认值为 `2`。

```json
{ "tabWidth": 2 }
```

### `useTabs` — 是否使用制表符缩进

设为 `true` 时使用 Tab 代替空格，默认值为 `false`。

```json
{ "useTabs": false }
```

### `semi` — 语句末尾是否加分号

默认值为 `true`，设为 `false` 则省略分号。

```json
{ "semi": false }
```

### `singleQuote` — 是否使用单引号

设为 `true` 时字符串使用单引号，默认使用双引号。

```json
{ "singleQuote": true }
```

### `trailingComma` — 末尾逗号

控制对象、数组等末尾是否加逗号，可选值：

| 值 | 说明 |
|---|---|
| `"none"` | 不添加尾逗号（默认） |
| `"es5"` | 在 ES5 合法的地方添加 |
| `"all"` | 所有可能的位置都添加（含函数参数） |

```json
{ "trailingComma": "all" }
```

### `bracketSpacing` — 对象括号内空格

控制 `{ a: 1 }` 这种形式中括号内是否有空格，默认值为 `true`。

```json
{ "bracketSpacing": true }
```

### `jsxBracketSameLine` — JSX 右括号位置

设为 `true` 时，JSX 的 `>` 与最后一个属性同行，默认值为 `false`。

```json
{ "jsxBracketSameLine": true }
```

### `arrowParens` — 箭头函数参数括号

| 值 | 效果 |
|---|---|
| `"always"` | 始终加括号：`(x) => x`（默认） |
| `"avoid"` | 单参数时省略：`x => x` |

```json
{ "arrowParens": "always" }
```

### `endOfLine` — 行尾换行符

| 值 | 说明 |
|---|---|
| `"lf"` | Unix/Linux 风格（默认） |
| `"crlf"` | Windows 风格 |
| `"auto"` | 自动检测现有文件格式 |

```json
{ "endOfLine": "lf" }
```

---

## 完整示例配置

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "jsxBracketSameLine": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 支持的文件格式

| 格式 | 文件名 |
|---|---|
| JSON | `.prettierrc` 或 `.prettierrc.json` |
| YAML | `.prettierrc.yml` 或 `.prettierrc.yaml` |
| JavaScript | `.prettierrc.js` |

JavaScript 格式示例：

```js
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  jsxBracketSameLine: true,
  arrowParens: "always",
  endOfLine: "lf"
}
```