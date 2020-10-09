---
title: vuejs 应用性能优化-part 1
date: 2019-05-18 00:49:08
tags:
  - vue
  - 性能
author: 左智文
img: https://img.90c.vip/vue-cover/img006.jpg?x-oss-process=image/format,webp
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
# top: true
# cover: true
# coverImg: https://cdn-images-1.medium.com/max/2600/1*Z8V4nPzrELcD2Tkjy4DtNQ.png
summary: 在本系列的这一部分中，我们将重点关注性能优化和延迟加载简介。
categories: vue
---

虽然移动优先方法成为标准且不确定的网络条件是我们应该始终考虑的事情，但是保持应用程序快速加载变得越来越困难。在本系列中，我将深入研究我们在[Vue Storefront](https://github.com/DivanteLtd/vue-storefront)中使用的 Vue 性能优化技术，并且您可以在 Vue.js 应用程序中使用它们使它们立即加载并顺利执行。我的目标是让这个系列成为关于 Vue 应用程序性能的完整而完整的指南。

+ 性能优化和延迟加载简介-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-1-introduction-to-performance-optimization-and-lazy-29e4ff101019)。
+ [延迟加载路由和Vendor bundle 反模式](https://www.90c.vip/2019/05/18/vuejs-1/)-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-2-lazy-loading-routes-and-vendor-bundle-anti-pattern-4a62236e09f9)。
+ [延迟加载 Vuex 模块](https://www.90c.vip/2019/05/18/vuejs-2/)
+ 提供良好的等待体验和延迟加载单个组件 - `待完善`
+ 懒加载库并找到更小的等价物 - `待完善`
+ UI 库的性能友好使用
+ 尽快使用 Service Worker 缓存 - `待完善`
+ Prefetching - `待完善`

## Webpack 捆绑如何工作？

本系列中的大多数技巧都将集中在使我们的 JS 包更小。要了解它，首先我们需要了解 Webpack 如何捆绑所有文件。

捆绑我们的资产时，Webpack 正在创建一个称为`依赖图`的东西。它是一个基于导入链接所有文件的图表。假设我们在 webpack 配置中指定了一个名为`main.js`的文件作为入口点，它将成为我们依赖图的根。现在，我们将在此文件中导入的每个 js 模块将成为图中的节点，并且在此节点中导入的每个模块都将成为其节点。

Webpack 使用此依赖关系图来检测它应该包含在输出包中的文件。输出包只是一个（或我们将在后面的部分中看到的多个）javascript 文件，其中包含依赖图中的所有模块。

我们可以这样说明这个过程：

![图1](https://img.90c.vip/code/img029.png?x-oss-process=image/format,webp)

现在，当我们知道捆绑如何工作时，很明显我们的项目将会越多，最大的初始 JavaScript 捆绑包就会出现。下载和解析它所需的时间越长，以便用户稍后会看到有意义的内容。用户等待的时间越长，他/她将离开我们的网站的可能性越大。

简而言之，更大的捆绑=更少的用户。至少在大多数情况下。

## 懒加载

那么当我们仍然需要添加新功能并改进我们的应用程序时，我们如何切割捆绑包大小？答案很简单 - 延迟加载和代码分割。

顾名思义，延迟加载会懒加载应用程序的部分内容。换句话说 - 只有在我们真正需要它们时加载它们。代码拆分只是将应用程序拆分为这个延迟加载的块。

![图2](https://img.90c.vip/code/img030.png?x-oss-process=image/format,webp)

在大多数情况下，您不需要在用户访问您的网站后立即使用 Javascript 包中的所有代码。即使我们的应用程序中有 3 条不同的路由，无论用户最终在哪里，他/她总是需要下载，解析并执行所有这些路由，即使只需要一个。多么浪费时间和精力！

延迟加载允许我们拆分捆绑包并仅提供所需的部分，这样用户就不会浪费时间下载和解析不会被使用的代码。

要查看我们网站中实际使用了多少 JavaScript 代码，我们可以转到 devtools - > cmd + shift + p - >类型覆盖 - >点击'记录'。现在我们应该能够看到实际使用了多少下载的代码。

![图3](https://img.90c.vip/code/img031.png?x-oss-process=image/format,webp)

`标记为红色的所有内容都是当前路线上不需要的东西，可以延迟加载`。如果您正在使用源映射，则可以单击此列表中的任何文件，并查看未调用哪些部分。正如我们所看到的，甚至 vuejs.org 还有很大的改进空间;）。

通过延迟加载适当的组件和库，我们设法将[Vue Storefront](https://github.com/DivanteLtd/vue-storefront)的捆绑大小减少了 60％！

好吧，我们知道延迟加载是什么，它非常有用;）

是时候看看我们如何在 Vue.js 应用程序中使用它。

## 动态导入

我们可以使用[webpack 动态导入](https://webpack.js.org/guides/code-splitting/)轻松地加载我们应用程序的某些部分。让我们看看它们的工作原理以及它们与常规进口的区别。

如果我们将以这样的标准方式导入 JS 模块：

```js
// main.js
import ModuleA from "./module_a.js";
ModuleA.doStuff();
```

它将作为 main.js 的节点添加到依赖关系图中并与其捆绑在一起。

但是，如果我们仅在某些情况下需要`ModuleA`，比如对用户交互的响应呢？将此模块与我们的初始捆绑捆绑在一起是一个坏主意，因为根本不需要它。我们需要一种方法告诉我们的应用程序什么时候应该下载这段代码。

这是动态导入可以帮助我们的地方！现在看一下这个例子：

```js
//main.js
const getModuleA = () => import('./module_a.js')
// invoked as a response to some user interaction
getModuleA().then({ doStuff } => doStuff())
```

我们来看看这里发生的事情：

我们创建了一个返回`import（）`函数的函数，而不是直接导入`module_a.js`。_现在 webpack 会将动态导入模块的内容捆绑到一个单独的文件中，除非调用该函数，否则不会调用导入，也不会下载文件_。稍后在代码中我们下载了这个可选的代码块作为对某些用户交互的响应（如路由更改或单击）。

通过动态导入，我们基本上隔离了给定节点（在这种情况下是`module_a`），它将被添加到依赖图并在我们决定需要时下载这部分（_这意味着我们也在切断在`module_a`中导入的模块_）。

让我们看另一个更好地说明这种机制的例子。

假设我们有 4 个文件：`main.js`，`module_a.js`，`module_b.js`和`module_c.js`。要了解动态导入的工作方式，我们只需要`main`和`module_a`的源代码：

```js
//main.js
import ModuleB from './mobile_b.js'
const getModuleA = () => import('./module_a.js')
getModuleA().then({ doStuff } => doStuff())
//module_a.js
import ModuleC from './module_c.js'
```

通过使`module_a`成为一个动态导入的模块，我们正在使用`module_a`及其所有子代切割依赖图的一部分。当`module_a`被动态导入时，它会与在其中导入的模块一起加载。

换句话说，我们只是为依赖图创建一个新的入口点。

![图4](https://img.90c.vip/code/img032.png?x-oss-process=image/format,webp)

## 延迟加载 Vue 组件

我们知道什么是延迟加载以及为什么需要它。是时候看看我们如何在 Vue 应用程序中使用它了。

好消息是它非常简单，我们可以懒加载整个 SFC 以及它的 css 和 html，语法与以前相同！

```js
const lazyComponent = () => import("Component.vue");
```

......这就是你所需要的！现在只有在请求时才会下载组件。以下是调用 Vue 组件动态加载的最常用方法：

+ 调用带导入的函数

```js
const lazyComponent = () => import("Component.vue");
lazyComponent();
```

+ 请求组件呈现

```js
<template>
  <div>
    <lazy-component />
  </div>
</template>
<script>
const lazyComponent = () => import("Component.vue");
export default {
  components: { lazyComponent }
};
</script>
```

请注意，仅当请求组件在模板中呈现时，才会调用`lazyComponent`函数。例如这段代码：

```js
<lazy-component v-if="false" />
```

不会动态导入组件，因为它没有添加到DOM（但是一旦值变为true就会这样做，这是有条件地延迟加载Vue组件的好方法）

## 总结

延迟加载是使您的Web应用程序更高效并切断其大小的最佳方法之一。我们学习了如何使用Vue组件进行延迟加载。在本系列的下一部分中，我将向您展示如何使用`vue-router`和异步路由拆分Vue应用程序代码。

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！