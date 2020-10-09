---
title: vuejs 应用性能优化-part 2
date: 2019-05-18 10:04:06
tags:
  - vue
  - 性能
author: 左智文
img: https://img.90c.vip/vue-cover/img006.jpg?x-oss-process=image/format,webp
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
# top: true
# cover: true
# coverImg: https://cdn-images-1.medium.com/max/2600/1*Z8V4nPzrELcD2Tkjy4DtNQ.png
summary: 本章节，我们将重点关注vue性能优化之延迟加载路由和Vendor bundle 反模式。
categories: vue
---

**在[上一篇文章](https://www.90c.vip/2019/05/18/vuejs/)中，我们了解了代码拆分是什么，它如何与Webpack一起工作以及如何在Vue应用程序中使用延迟加载来使用它。现在我们将深入研究代码，并学习最有用的代码分割Vue.js应用程序模式。**

本系列基于[Vue Storefront](https://github.com/DivanteLtd/vue-storefront)性能优化过程的学习。通过使用以下技术，我们能够将初始束的大小减少70％并使其在眨眼间加载。

+ [性能优化和延迟加载简介](https://www.90c.vip/2019/05/18/vuejs/)-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-1-introduction-to-performance-optimization-and-lazy-29e4ff101019)。
+ 延迟加载路由和Vendor bundle 反模式-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-2-lazy-loading-routes-and-vendor-bundle-anti-pattern-4a62236e09f9)。
+ [延迟加载 Vuex 模块](https://www.90c.vip/2019/05/18/vuejs-2/)
+ 提供良好的等待体验和延迟加载单个组件 - `待完善`
+ 懒加载库并找到更小的等价物 - `待完善`
+ UI 库的性能友好使用 - `待完善`
+ 尽快使用 Service Worker 缓存 - `待完善`
+ Prefetching - `待完善`

## 应用程序增长的问题

`Vue-router`是一个库，允许自然地将我们的Web应用程序拆分为单独的页面。每个页面都是与某个特定URL路径关联的路由。

知道这一点，我们有一个简单的投资组合应用程序，具有以下结构：

![整个JS代码捆绑在一个文件中 -  app.js](https://img.90c.vip/code/img033.png?x-oss-process=image/format,webp)

您可能已经注意到，根据我们访问的路线，我们可能不需要`Home.vue`或`About.vue`（带有它的lodash依赖关系）但它们都在相同的`app.js`包中，无论路由用户是什么，都会被下载访问。浪费下载和解析时间！

如果我们正在下载一条额外的路线，这并不是什么大问题，但你可以想象这个应用程序越来越大，任何新的添加都意味着在首次访问时下载更大的捆绑包。

**只有1秒足以让用户进行心理上下文切换并且（可能）离开我们的网站时**，这是不可接受的！

![图2](https://img.90c.vip/code/img034.png?x-oss-process=image/format,webp)

## 使用vue-router进行基于路由的代码分割

为了避免通过实际使其更好地使我们的应用程序变得更糟，我们只需要使用我们在前一篇文章中学习的动态导入语法为每个路由创建单独的包。

像Vue.js中的其他所有东西一样 - 它非常简单。我们只需要在那里传递动态导入功能，而不是将组件直接导入到路径对象中。仅当解析给定路线时才会下载路线组件。

所以不要像这样静态导入路径组件：

```js
import RouteComponent form './RouteComponent.vue'
const routes = [{ path: /foo', component: RouteComponent }]
```

我们需要动态导入它，这将创建一个包含此路由的新绑定包作为入口点：

```js
const routes = [
  { path: /foo', component: () => import('./RouteComponent.vue') }
]
```

知道了这一点，让我们看看我们的绑定和路由如何与动态导入一样：

![图3](https://img.90c.vip/code/img035.png?x-oss-process=image/format,webp)

通过此设置，webpack将创建三个包：

+ `app.js`  - 我们的主要包含应用程序入口点（`main.js`）和每个路径所需的库/组件
+ `home.js`  - 绑定主页，只有在输入带路径的路径时才会下载
+ `about.js`  - 捆绑了`about页面`（并且它是dependendy  -  lodash），只有在输入路径为`/about` path时才会下载。

>Bundle名称不是webpack生成的真实名称，以便于理解。Webapck实际上正在生成类似0.js 1.js等，具体取决于您的webpack配置。

这种技术几乎适用于所有应用，并且可以提供非常好的结果。

在许多情况下，基于路由的代码拆分将解决您的所有性能问题，并且可以在几分钟内应用于几乎任何应用程序！

## Vue生态系统中的代码拆分

您可能正在使用Nuxt或vue-cli来创建您的应用程序。如果是这样，重要的是要知道它们都有关于代码拆分的一些自定义行为：

+ **在vue-cli 3中**，默认情况下将预取所有延迟加载的块。我们将在稍后学习如何使用预取。如果你想了解更多关于vue-cli中的preftching的信息，请关注我的博客。

+ **在Nuxt中**，如果我们使用Nuxt路由系统，所有页面路由都是开箱即用的

现在让我们来看看非常流行且常用的反模式，它可以使基于路由的代码拆分影响力降低。

## Vendor bundle反模式

Vendor bundle 通常用于包含`node_modules`中所有模块的单独js文件的上下文中。

虽然将所有内容放在这里以将所有依赖项保存在一个地方并缓存它们可能很诱人，但这种方法引入了将所有路由捆绑在一起时遇到的相同问题：

![图4](https://img.90c.vip/code/img036.png?x-oss-process=image/format,webp)

你看到了问题吗？即使我们只需要在一个路由中使用lodash（它是其中一个依赖项），它就会捆绑在`vendor.js`中以及所有其他依赖项中，因此它将始终下载。

将所有依赖项捆绑在一个文件中听起来很诱人，但会使您的应用加载时间更长。我们可以做得更好！

离开我们的应用程序就像基于路由的代码吐出一样，足以确保只下载所需的代码。但它会导致一些代码重复。

让我们假设`Home.vue`也需要lodash。

![图5](https://img.90c.vip/code/img037.png?x-oss-process=image/format,webp)

在这种情况下，从`/about（About.vue）`导航到`/（Home.vue）`将最终导致两次下载lodash。

它仍然比下载大量的冗余代码更好，但是如果我们已经有了这种依赖，那么重用它就没有意义了，对吧？

这是webpack [splitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)可以帮助我们的地方。只需将这几行添加到webpack配置中，我们就会将公共依赖项分组到一个单独的包中，以便共享它们。

```js
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

在`chunks`属性中，我们只是告诉webpack应该优化哪些代码块。您可能已经猜到了将此属性设置为all，这意味着它应该优化所有这些属性。

您可以在[webpack](https://webpack.js.org/guides/code-splitting/#prevent-duplication)文档中阅读有关此过程的更多信息

## 总结

按路由拆分代码是保持最初下载的捆绑包大小较低的最佳（也是最简单）方法之一。在下一部分中，我们将了解所有其他小部件（Vuex存储和单个组件），这些部件可以从主捆绑中切断并且懒洋洋地加载。

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！