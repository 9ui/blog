---
title: lozad.js懒加载神器
date: 2019-05-08 21:55:48
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
tags:
  - 性能
  - 工具类
author: 左智文
img: https://img.90c.vip/js-cover/1146014_da83.jpg?x-oss-process=image/format,webp
# img: https://raw.githubusercontent.com/ApoorvSaxena/lozad.js/HEAD/banner/lozad-banner.jpg
summary: 本章节，介绍一种懒加载神器lozad.js以及相应用法。
categories: 前端
---

## 前言

- 延迟使用纯 JavaScript 加载元素
- 是一个轻量级的库，压缩后的只有`1.04kb`
- 没有依赖
- 允许延迟加载动态添加的元素
- 支持`<img>`，`<picture>`，iframe，视频，音频，响应式图像，背景图片等
- 是完全免费和开源的

> 它的目的是使用最近添加的 Intersection Observer API 延迟加载图像，iframe，广告，视频或任何其他元素，并带来巨大的性能优势。

## 安装

```bush
# You can install lozad with npm
$ npm install --save lozad

# Alternatively you can use Yarn
$ yarn add lozad

# Another option is to use Bower
$ bower install lozad
```

可以作为一个模块使用和`rollup` 和`webpack`一样

```js
// using ES6 modules
import lozad from "lozad";

// using CommonJS modules
var lozad = require("lozad");
```

或者通过 CDN 加载并包含在页面的 head 标签中

```js
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js"
/>
```

## 使用

在 HTML 中，为元素添加标识符（标识的默认选择器是 lozad 类）

```html
<img class="lozad" data-src="image.png" />
```

您现在需要做的只是实例化 Lozad，如下所示:

```js
const observer = lozad();
observer.observe();
```

或者使用 DOM 元素引用

```js
const el = document.querySelector("img");
const observer = lozad(el);
observer.observe();
```

或者自定义选项

```js
const observer = lozad(".lozad", {
  rootMargin: "10px 0px", // syntax similar to that of CSS Margin
  threshold: 0.1 // ratio of element convergence
});
observer.observe();
```

> 参考
> [IntersectionObserver options: rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) > [IntersectionObserver options: thresholds](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)

如果要为加载元素提供自定义函数定义

```js
lozad(".lozad", {
  load: function(el) {
    console.log("loading element");
    // Custom implementation to load an element
    // e.g. el.src = el.getAttribute('data-src');
  }
});
```

如果要扩展元素的加载状态，可以添加加载的选项

> 注意：lozad 使用“data-loaded”=“true”属性来确定先前是否已加载元素

```js
lozad(".lozad", {
  loaded: function(el) {
    // Custom implementation on a loaded element
    el.classList.add("loaded");
  }
});
```

使用响应式图像

```js
<!-- responsive image example -->
<img class="lozad" data-src="image.png" data-srcset="image.png 1000w, image-2x.png 2000w" />
```

与背景图像一起使用

```js
<!-- background image example -->
<div class="lozad" data-background-image="image.png">
</div>
```

如果您希望在图像出现之前加载它们

```js
const observer = lozad();
observer.observe();

const coolImage = document.querySelector(".image-to-load-first");
// ... trigger the load of a image before it appears on the viewport
observer.triggerLoad(coolImage);
```

## 带图片标签的示例

> IE 浏览器不支持图片标签！您需要使用 IE 浏览器的源设置 data-iesrc 属性（仅适用于您的图片标记）

> data-alt 属性可以添加到图片标记，以便在延迟加载图像的 alt 属性中使用

```js
<!-- For an element to be caught, add a block type that is different from the inline and some min-height for correct caught into view -->

<picture class="lozad" style="display: block; min-height: 1rem" data-iesrc="images/thumbs/04.jpg" data-alt="">
    <source srcset="images/thumbs/04.jpg" media="(min-width: 1280px)">
    <source srcset="images/thumbs/05.jpg" media="(min-width: 980px)">
    <source srcset="images/thumbs/06.jpg" media="(min-width: 320px)">

    <!-- NO img element -->
    <!-- instead of img element, there will be the last source with the minimum dimensions -->
    <!-- for disabled JS you can set <noscript><img src="images/thumbs/04.jpg" alt=""></noscript> -->

</picture>
```

当 lozad 加载这个图片元素时，它会修复它

## iframe 的示例

```js
<iframe data-src="embed.html" class="lozad" />
```

## 样式切换

```js
<div data-toggle-class="active" class="lozad">
    <!-- content -->
</div>
```

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
