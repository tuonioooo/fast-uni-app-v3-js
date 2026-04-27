# 静态资源

## 免费的线上图片资源

https://picsum.photos/

这是一个**免费的随机图片占位服务**，专门给开发者在测试和开发时使用。

用法很简单，直接在 URL 里指定尺寸就能拿到一张随机风景/自然照片：

```
https://picsum.photos/200/300      # 宽200 高300
https://picsum.photos/400          # 400x400 正方形
https://picsum.photos/seed/abc/300 # 用 seed 固定同一张图
https://picsum.photos/200?grayscale # 灰度图
```

比如：

```js
// mock 数据时可以这样用
{
  id: 1,
  title: '深圳音乐节',
  coverUrl: 'https://picsum.photos/seed/1/400/256',  // 固定显示同一张
  status: '报名中',
  // ...
}
```

用 `seed` 参数的好处是同一个 seed 每次返回的图片一样，列表刷新时图片不会乱跳。