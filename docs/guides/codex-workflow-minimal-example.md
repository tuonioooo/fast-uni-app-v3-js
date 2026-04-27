# Codex 最小使用示例

这份文档说明在当前 `fast-uni-app-v3-js` 仓库中，如何基于已有 `.codex/agents` 和 `.codex/skills`，把一张原型图落成一条最小可用业务链路。

适用场景：

- 你拿到的是原型图、截图、设计稿
- 你希望 Codex 不只是“画页面”，而是按仓库规范补齐页面、跳转、mock、配置和验证说明

## 1. 当前默认能力

当前仓库已经具备两层能力：

- skill
  - `ui-prototype-to-page`
  - `multi-role-ui-delivery`
- agent workflow
  - `requirements-analyst`
  - `frontend-engineer`
  - `refactor-engineer`
  - `tester`
  - `reporter`

如果任务是单页落地，优先用 `ui-prototype-to-page`。

如果任务是整条业务链路改造，优先用 `multi-role-ui-delivery`。

## 2. 最小推荐输入

给 Codex 的输入，至少建议包含：

- 原型图
- 目标目录
- 是否新建页面
- 是否接现有链路
- 使用 mock 还是真接口

例如：

```text
使用 `multi-role-ui-delivery`。

这是活动详情页原型图。
请落到 `pages/activity_detail`，
并接到 `activity_list -> activity_detail -> activity_booking -> activity_success_modal` 这条链路里。
先用 mock，按当前仓库规范实现，最后检查未引用图片和交互闭环。
```

## 3. 一次完整执行会发生什么

如果你使用 `multi-role-ui-delivery`，Codex 默认会按下面顺序处理：

1. `requirements-analyst`
   - 拆页面目标、交互、字段、参数流转
2. `frontend-engineer`
   - 实现 `pages/*`、必要的 `api/*`、`mock/*`、`pages.json`
3. `refactor-engineer`
   - 清理原型残留结构、重复逻辑、未引用资源
4. `tester`
   - 检查入口、跳转、参数、表单、成功反馈、配置同步
5. `reporter`
   - 输出最终交付说明、验证结论和剩余风险

## 4. 最小闭环示例

下面是一条适合当前仓库的最小业务闭环示例：

```text
activity_list -> activity_detail -> activity_booking -> activity_success_modal
```

对应目标：

- `activity_list`
  - 展示活动列表
  - 点击某个活动进入详情
- `activity_detail`
  - 展示活动详情
  - 点击“立即预约”进入报名页
- `activity_booking`
  - 填写预约信息
  - 提交后弹出成功反馈
- `activity_success_modal`
  - 展示成功反馈
  - 支持关闭、返回、继续查看

## 5. 单页任务怎么发

如果只是做一个页面，不需要整条 workflow，直接这样发：

```text
使用 `ui-prototype-to-page`。

这是一个活动报名页原型图，请落到 `pages/activity_booking`。
先用 mock 数据，按当前仓库规范实现。
如需新页面请补 `pages.json`，最后检查未引用图片并给验证结论。
```

## 6. 链路任务怎么发

如果是多页面联动，直接这样发：

```text
使用 `multi-role-ui-delivery`。

这是活动模块的一组原型图，请完成以下链路：
`activity_list -> activity_detail -> activity_booking -> activity_success_modal`

要求：
1. 先拆需求和页面交互
2. 再完成页面实现
3. 再检查重复代码和未引用图片
4. 最后做验证总结
```

## 7. 只想先看分析怎么发

如果你暂时不想写代码，只想看需求拆解：

```text
使用 `multi-role-ui-delivery`，但这次先只执行 `requirements-analyst`。

这是活动详情页原型图，请先不要写代码，只输出：
1. 页面目标
2. 页面区块
3. 参数流转
4. 字段设计
5. 与 `activity_list` 和 `activity_booking` 的交互关系
6. 风险点和待确认项
```

## 8. 交付结果应该怎么看

一次合格的执行结果，默认应该能回答清楚这些问题：

- 页面或链路改了什么
- 是否补了 `pages.json`
- 是否补了 mock / API
- 页面之间现在怎么跳
- 参数怎么传
- 图片资源有没有未引用文件
- 是否已经形成业务闭环
- 还有哪些风险没处理

## 9. 简化理解

你可以把这套东西理解成：

- `ui-prototype-to-page`
  - 负责“把图变成当前仓库能用的页面代码”
- `multi-role-ui-delivery`
  - 负责“把单页实现组织成一条可交付的业务闭环”

如果不想区分太细，日常直接优先说：

```text
使用 `multi-role-ui-delivery` 处理这组原型图。
```

一般就够了。
