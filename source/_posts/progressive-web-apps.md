---
title: 渐进式加载
date: 2019-05-17 23:39:47
tags:
 - 性能
 - 用户体验
author: 左智文
img: https://img.90c.vip/other-cover/1299186_1e0a.jpg?x-oss-process=image/format,webp
summary: 在本文中，我们将通过逐步加载其资源来进一步提高应用程序的性能。
categories: 用户体验
---

在之前的文章中，我们介绍了有助于我们将`js13kPWA`示例作为渐进式Web应用程序的API：`Service Workers`, `Web Manifests`, `Notifications and Push` 。在本文中，我们将通过逐步加载其资源来进一步提高应用程序的性能。

## 第一次绘画

尽快向用户提供有意义的内容非常重要 - 等待页面加载的时间越长，他们在等待完成所有内容之前离开的机会就越大。我们应该能够向他们展示他们想要看到的页面的基本视图，在这些地方使用占位符，最终将加载更多内容。

这可以通过渐进式加载来实现 - 也称为[延迟加载](https://en.wikipedia.org/wiki/Lazy_loading)。这就是推迟加载尽可能多的资源（HTML，CSS，JavaScript），并且只加载那些第一次体验真正需要的资源。

## 捆绑与分割

许多访问者不会浏览网站的每个页面，但通常的方法是将我们拥有的每个功能都捆绑到一个大文件中。`bundle.js`文件可以是多兆字节，单个`style.css`包可以包含从基本CSS结构定义到网站每个版本的所有可能样式的所有内容：移动，平板电脑，桌面，仅打印等。

将所有信息作为一个文件而不是许多小文件加载会更快，但如果用户一开始并不需要所有信息，我们只能加载关键信息，然后在需要时管理其他资源。

## 渲染阻塞资源

捆绑是一个问题，因为浏览器必须先加载HTML，CSS和JavaScript，然后才能将渲染结果绘制到屏幕上。在初始网站访问和加载完成之间的几秒钟内，用户看到一个空白页面，这是一种糟糕的体验。

为了解决这个问题，我们可以添加defer到JavaScript文件：

```js
<script src="app.js" defer></script>
```

它们将在解析文档本身后下载并执行，因此不会阻止呈现HTML结构。我们还可以拆分css文件并向它们添加媒体类型：

```js
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="print.css" media="print">
```

这将告诉浏览器仅在满足条件时加载它们。

在我们的js13kPWA演示应用程序中，CSS非常简单，可以将它全部保存在一个文件中，而没有关于如何加载它们的特定规则。我们可以更进一步，将所有内容从`style.css`移动到`index.html`的`<head>`中的`<style>`标签 - 这将进一步提高性能，但为了示例的可读性，我们也将跳过这种方法。

## 图片

除了JavaScript和CSS，网站可能包含许多图像。当您在HTML中包含`<img>`元素时，将在初始网站访问期间提取和下载每个引用的图像。在宣布网站准备就绪之前，要下载兆字节的图像数据并不罕见，但这再次造成了对性能的不良看法。在查看网站的最初阶段，我们不需要所有质量最佳的图像。

这可以优化。首先，您应该使用类似于[TinyPNG](https://tinypng.com/)的工具或服务，这将减少图像的文件大小而不会过多地改变质量。如果您已经过了这一点，那么您可以开始考虑使用JavaScript优化图像加载。我们将在下面表达出来。

### 占位符图像

我们可以通过JavaScript选择性地执行此操作，而不是拥有`<img>` 元素 `src`属性中引用的游戏的所有屏幕截图，这将强制浏览器自动下载它们。js13kPWA应用程序使用占位符图像，它小而轻，而目标图像的最终路径存储在`data-src`属性中：

```js
<img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg' alt='NAME'>
```

在网站完成HTML结构构建之后，这些图像将通过JavaScript加载。占位符图像的缩放方式与原始图像的缩放方式相同，因此它将占用相同的空间，并且不会导致布局在图像加载时重新绘制。

### 通过JavaScript加载

`app.js`文件处理`data-src`属性，如下所示：

```js
var imagesToLoad = document.querySelectorAll('img[data-src]');
var loadImages = function(image) {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = function() {
    image.removeAttribute('data-src');
  };
};
```

`imagesToLoad`变量包含对所有图像的引用，而`loadImages`函数将路径从`data-src`移动到`src`。当实际加载每个图像时，我们将删除其`data-src`属性，因为它不再需要了。然后我们遍历每个图像并加载它：

```js
imagesToLoad.forEach(function(img) {
  loadImages(img);
});
```

### 在CSS中模糊

为了使整个过程更具视觉吸引力，占位符在CSS中模糊不清。

![图1](https://img.90c.vip/code/img028.png?x-oss-process=image/format,webp)

我们在开始时渲染图像模糊，因此可以实现向锐利图像的过渡：

```css
article img[data-src] {
  filter: blur(0.2em);
}

article img {
  filter: blur(0em);
  transition: filter 0.5s;
}
```

这将在半秒内消除模糊效果，这对于“加载”效果看起来足够好。

## 按需加载

上一节中讨论的图像加载机制可以正常工作 - 它在渲染HTML结构后加载图像，并在过程中应用一个很好的过渡效果。问题是它仍然会立即加载所有图像，即使用户在页面加载时只会看到前两个或三个。

使用新的`Intersection Observer API`可以解决这个问题 - 使用它可以确保只有当图像出现在视口中时才会加载图像。

### 交叉观察

这是对先前工作示例的渐进增强 - 交叉观察器仅在用户向下滚动时加载目标图像，使其显示在视口中。

以下是相关代码的样子：

```js
if('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function(items, observer) {
    items.forEach(function(item) {
      if(item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  });
  imagesToLoad.forEach(function(img) {
    observer.observe(img);
  });
} else {
  imagesToLoad.forEach(function(img) {
    loadImages(img);
  });
}
```

如果支持`IntersectionObserver`对象，则应用程序会创建它的新实例。作为参数传递的函数处理当一个或多个项目与观察者相交时（即，出现在视口内）的情况。我们可以迭代每个案例并做出相应的反应 - 当图像可见时，我们加载正确的图像并停止观察它，因为我们不再需要观察它。

让我们重申我们之前提到的渐进式增强 - 编写代码，以便无论是否支持交叉观察器，应用程序都能正常工作。如果不是，我们只需使用前面介绍的更基本的方法加载图像。

## 改进

请记住，有许多方法可以优化加载时间，本示例仅探讨其中一种方法。您可以尝试通过让它们在没有JavaScript的情况下工作来使您的应用程序更具防弹性 - 使用`<noscript>`显示已分配最终src的图像，或者使用指向目标图像的`<a>`元素包装`<img>`标记，用户可以在需要时单击并访问它们。

我们不会这样做，因为应用程序本身依赖于JavaScript  - 没有它，甚至不会加载游戏列表，并且不会执行`Service Worker`代码。

我们可以重写加载过程，不仅加载图像，还加载由完整描述和链接组成的完整项目。它会像无限滚动一样工作 - 仅当用户向下滚动页面时才加载列表中的项目。这样，最初的HTML结构将是最小的，加载时间甚至更小，我们将获得更大的性能优势。

## 结论

减少最初要加载的文件，将较小的文件拆分为模块，使用占位符以及按需加载更多内容 - 这将有助于实现更快的初始加载时间，从而为应用程序创建者带来好处并为用户提供更流畅的体验。

请记住渐进增强方法 - 提供可用的产品，无论设备或平台，但一定要丰富使用现代浏览器的人的体验。

## 最后的想法

这就是本教程系列的全部内容 - 我们浏览了js13kPWA示例应用程序的源代码，了解了渐进式Web应用程序功能的使用，包括`简介`，`PWA结构`，与`Service Worker`的离线可用性，`可安装的PWA`以及最终通知。我们还在`Service Worker Cookbook`的帮助下解释了推送。在本文中，我们研究了渐进式加载的概念，包括一个使用`Intersection Observer API`的有趣示例。

随意尝试代码，使用PWA功能增强现有应用程序，或者自己构建全新的内容。与常规Web应用程序相比，PWA具有巨大的优势。

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
