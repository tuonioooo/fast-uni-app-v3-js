# .prettierrc 文件说明 

`.prettierrc` 文件是用于配置 **Prettier** 的格式化规则的配置文件。你可以在这个文件中指定你希望 Prettier 使用的代码风格选项，比如代码行宽、缩进方式、分号是否强制等。`.prettierrc` 文件通常是一个 JSON 或 YAML 格式的文件，或者你也可以使用 JavaScript 来导出配置。

官方文档：https://prettier.io/docs/

### `.prettierrc` 文件常见配置项

以下是一些常见的 Prettier 配置选项，它们可以帮助你定制代码格式化规则：

### 1. **`printWidth`** — 每行的最大字符数

定义代码中每行的最大字符数，超过这个长度时会自动换行。

```json id="v2ylff"
{
  "printWidth": 80
}
```

### 2. **`tabWidth`** — 设置每个缩进级别的空格数

定义缩进时每一级的空格数。

```json id="h91pbv"
{
  "tabWidth": 2
}
```

### 3. **`useTabs`** — 是否使用制表符进行缩进

如果设置为 `true`，Prettier 将使用制表符（Tab）进行缩进，而不是空格。

```json id="shhzz1"
{
  "useTabs": false
}
```

### 4. **`semi`** — 是否在语句末尾添加分号

控制是否在每个语句末尾添加分号，默认为 `true`。

```json id="l2tkon"
{
  "semi": false
}
```

### 5. **`singleQuote`** — 使用单引号而不是双引号

设置为 `true` 时，Prettier 会使用单引号（`'`）而不是双引号（`"`）来包裹字符串。

```json id="bq1cfz"
{
  "singleQuote": true
}
```

### 6. **`trailingComma`** — 尾逗号配置

设置如何处理对象、数组等尾部的逗号。可以选择以下几种模式：

* `"none"`：不添加尾逗号（默认）
* `"es5"`：在 ES5 中有效的地方添加尾逗号
* `"all"`：在所有可能的位置添加尾逗号（如函数参数等）

```json id="y52qvq"
{
  "trailingComma": "all"
}
```

### 7. **`bracketSpacing`** — 对象字面量的空格

控制对象字面量中的括号内是否添加空格。

```json id="zm6tq3"
{
  "bracketSpacing": true
}
```

### 8. **`jsxBracketSameLine`** — JSX 标签的右括号是否另起一行

设置为 `true` 时，JSX 中的右括号会和最后一个属性在同一行。

```json id="ri5pkx"
{
  "jsxBracketSameLine": true
}
```

### 9. **`arrowParens`** — 箭头函数的括号

设置箭头函数中参数是否需要括号。可选值：

* `"always"`：总是使用括号（例如：`(x) => x`）
* `"avoid"`：仅当参数是单个变量时，避免括号（例如：`x => x`）

```json id="ejxtpg"
{
  "arrowParens": "always"
}
```

### 10. **`endOfLine`** — 结束行符

设置行尾使用的换行符类型，可以选择以下几种：

* `"lf"`：仅换行符（适用于 Unix/Linux 系统）
* `"crlf"`：回车换行符（适用于 Windows 系统）
* `"auto"`：保持文件中的现有行尾符（自动检测）

```json id="ehy1j7"
{
  "endOfLine": "lf"
}
```

### 示例 `.prettierrc` 配置

```json id="dxgdq5"
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

### 配置格式

`.prettierrc` 文件支持几种不同的格式：

1. **JSON 格式**（最常见的方式，通常是 `.prettierrc` 文件）：

   * `.prettierrc` 或 `.prettierrc.json`
2. **YAML 格式**（如果你更喜欢 YAML 风格的配置）：

   * `.prettierrc.yml` 或 `.prettierrc.yaml`
3. **JavaScript 格式**（使用 JavaScript 导出配置）：

   * `.prettierrc.js`

### 示例 JavaScript 格式的 `.prettierrc.js`：

```js id="lmbnuh"
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
};
```

### 总结：

* `.prettierrc` 文件用于配置 Prettier 的格式化规则，提供了许多定制选项，可以帮助你控制代码风格。
* 你可以通过 JSON、YAML 或 JavaScript 文件来配置。
* 常见配置项包括行宽、缩进方式、是否使用分号、尾逗号等。

通过 `.prettierrc` 配置，你可以确保整个团队在格式化代码时遵循一致的风格。
