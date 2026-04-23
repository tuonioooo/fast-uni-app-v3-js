# 时间函数

## 介绍

本项目时间函数主要 依赖 `dayjs` 插件,  多久以前：采用的是uv-ui 中 提供的 方法 timeFrom(time, format = String | false)

```cmd
yarn add dayjs
or
npm install dayjs
```

官网：[dayjs](https://day.js.org/docs/zh-CN)

## 常用示例

这里将会介绍常用的示例用法, 复杂的用法可以参考官网

### dayjs 示例

```typescript
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

// 当前时间
const now = dayjs();

// 解析日期字符串
const date = dayjs('2021-01-01');

// 添加时间
const dateTime = now.add(1, 'day');

// 当前时间是否在 date 之前
const isBefore = now.isBefore(date);

// 当前时间是否在 date 之后
const isAfter = now.isAfter(date);

// 获取两个时间的相差天数
const date1 = dayjs('2021-01-01');

const date2 = dayjs('2021-01-05');

const diff = date1.diff(date2, 'day');

console.log('相差天数：', diff, '天');

// 日期计算  返回对应日期 加减后的日期值（过去第多少天，或者将来多少天）
// value +1 or -1 日期计算差值

const addDate = now.add(1, 'day');

const plusDate = now.add(-2, 'day');

console.log('明天的日期：', addDate,'昨天的日期：', plusDate);

// 获取当前时间是星期几
const weekday = now.get('day')
console.log('今天是星期' + weekday);

//获取或设置 ISO 星期几 ，其中 1 是星期一、7 是星期日。
dayjs.extend(isoWeek)
console.log('iso星期几' + dayjs().isoWeekday()) // gets the current ISO day of the week

// 格式化日期
const formatted1 = now.format('YYYY-MM-DD HH:mm:ss');

const formatted2 = now.format('YYYY-MM-DD');

console.log(now, date, dateTime, isBefore, isAfter, formatted1, formatted2);
```

### 多久以前: timeFrom(time, format = String | false) 示例

[https://www.uvui.cn/js/time.html](https://www.uvui.cn/js/time.html)

```vue
<template>
	<view>
		<view>时间1为：{{time1}}</view>
		<view>时间2为：{{time2}}</view>
		<view>时间3为：{{time3}}</view>
	</view>
</template>
<script>
	export default {
		computed: {
			// 刚刚
			time1(){
				return uni.$uv.timeFrom(new Date().getTime())
			},
			// 6个月前
			time2(){
				return uni.$uv.timeFrom(new Date('2023-02-06').getTime(),false)
			},
			// 2023年02月06日
			time3(){
				return uni.$uv.timeFrom(new Date('2023-02-06').getTime(),'yyyy年mm月dd日')
			}
		}
	}
</script>
```
