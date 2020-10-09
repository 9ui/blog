---
title: HTML5常用meta标签整理
date: 2019-06-13 14:09:18
tags:
- html
- meta标签
author: 左智文
img: https://img.90c.vip/vue-cover/img010.jpg?x-oss-process=image/format,webp
summary: 本章节，HTML5常用meta标签整理，meta标签提供关于HTML文档的元数据。
categories: 网站
---
>meta标签提供关于HTML文档的元数据。元数据不会显示在页面上，但是对于机器是可读的。它可用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他 web 服务；
html的meta标签描述的头部信息特别多，想记住也不容易，下面这篇文章就对这些标签经行了一个整理！

当然，如果你觉得下面的内容麻烦的话，我整理了一份，你可以直接访问这个链接：[常用meta模板页](https://github.com/justyeh/tool/blob/master/%E5%B8%B8%E7%94%A8meta%E6%A8%A1%E6%9D%BF/meta.html)


###### 声明文档使用的字符编码
```
<meta charset='utf-8'>
```

###### 声明文档的兼容模式
```
<!-- 启用360浏览器的极速模式(webkit) -->
<meta name="renderer" content="webkit">
<!-- 避免IE使用兼容模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

###### 设置页面viewport
```
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
//width    设置viewport宽度，为一个正整数，或字符串‘device-width’
//height   设置viewport高度，一般设置了宽度，会自动解析出高度，可以不用设置
//initial-scale    默认缩放比例，为一个数字，可以带小数
//minimum-scale    允许用户最小缩放比例，为一个数字，可以带小数
//maximum-scale    允许用户最大缩放比例，为一个数字，可以带小数
//user-scalable    是否允许手动缩放
```

###### SEO相关
```
<!-- 页面描述 -->
<meta name="description" content="不超过150个字符" />
<!-- 页面关键词 -->
<meta name="keywords" content="" />
<!-- 网页作者 -->
<meta name="author" content="name, email@gmail.com" />
<!-- 搜索引擎抓取 -->
<meta name="robots" content="index,follow" />
```

###### 移动端属性
```
<!-- 禁止自动自动识别 Email -->
<meta name="format-detection" content="email=no">
<!-- 禁止数字识自动别为电话号码 -->
<meta name="format-detection" content="telephone=no">
<!-- 禁止自动自动识别日期 -->
<meta name="format-detection" content="date=no">
```

## WebAPP全屏

```js
<!-- 是否启用 WebApp 全屏模式 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- 仅针对IOS的Safari顶端状态条的样式（可选default/black/black-translucent ） -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<!-- 设置苹果工具栏颜色 -->

<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<!-- UC强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- UC应用模式 -->
<meta name="browsermode" content="application">
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">

<!-- Chrome选项卡颜色 -->
<meta name="theme-color" content="#db5945">
```

## 其他

```js
<!-- 百度禁止转码 -->
<meta http-equiv="Cache-Control" content="no-siteapp" />
<!-- 添加 favicon icon -->
<link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
<!-- 添加 RSS 订阅 -->
<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
```