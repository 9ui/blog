---
title: vuejs 应用性能优化-part 3
date: 2019-05-18 10:49:40
tags:
  - vue
  - 性能
# top: true
# cover: true
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img006.jpg?x-oss-process=image/format,webp
# coverImg: https://cdn-images-1.medium.com/max/2600/1*Z8V4nPzrELcD2Tkjy4DtNQ.png
summary: 在本系列的这一部分中，我们将重点关注vue性能优化之延迟加载Vuex模块。
categories: vue
---

在[上一篇文章](https://www.90c.vip/2019/05/18/vuejs-1/)中，我们学习了足够强大的模式，可以显着提高应用程序的性能 - 每个路由分割代码。虽然每个路由拆分代码可能非常有用，但在用户访问我们的站点后，仍然有很多内部代码不需要。在本系列的这一部分中，我们将重点关注代码拆分我们的状态管理 - Vuex 模块。

本系列基于[Vue Storefront](https://github.com/DivanteLtd/vue-storefront)性能优化过程的学习。通过使用以下技术，我们能够将初始束的大小减少 70％并使其在眨眼间加载。

- [性能优化和延迟加载简介](https://www.90c.vip/2019/05/18/vuejs/)-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-1-introduction-to-performance-optimization-and-lazy-29e4ff101019)。
- [延迟加载路由和 Vendor bundle 反模式](https://www.90c.vip/2019/05/18/vuejs-1/)-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-2-lazy-loading-routes-and-vendor-bundle-anti-pattern-4a62236e09f9)。
- 延迟加载 Vuex 模块-[原文地址](https://itnext.io/vue-js-app-performance-optimization-part-3-lazy-loading-vuex-modules-ed67cf555976)
- 提供良好的等待体验和延迟加载单个组件 - `待完善`
- 懒加载库并找到更小的等价物 - `待完善`
- UI 库的性能友好使用 - `待完善`
- 尽快使用 Service Worker 缓存 - `待完善`
- Prefetching - `待完善`

## 两种类型的 Vuex 模块

在我们进一步了解如何懒加载[Vuex 模块](https://vuex.vuejs.org/guide/modules.html)之前，您需要注意一件重要的事情。您需要了解注册 Vuex 模块的可能方法是什么，以及它们的优缺点。

**静态 Vuex 模块**在 Store 初始化期间声明。以下是显式创建的静态模块的示例：

```js
// store.js
import { userAccountModule } from "./modules/userAccount";
const store = new Vuex.Store({
  modules: {
    user: userAccountModule
  }
});
```

上面的代码将创建一个带有静态模块`userAccountModule`的新 Vuex Store。静态模块不能取消注册（也不能延迟注册），并且在 Store 初始化后不能更改它们的结构（不是状态！）。

虽然这种限制对于大多数模块来说都不是问题，并且在一个地方声明所有这些限制对于将所有与数据相关的东西保存在一个地方非常有帮助，但这种方法存在一些缺点。

假设我们的应用程序中有一个带有专用 Vuex 模块的 Admin Dashboard。

```js
// store.js
import { userAccountModule } from "./modules/userAccount";
import { adminModule } from "./modules/admin";
const store = new Vuex.Store({
  modules: {
    user: userAccountModule,
    admin: adminModule
  }
});
```

你可以想象这样的模块可能非常庞大。尽管由于静态 Vuex 模块的集中注册，仪表板将仅由一小部分用户和应用程序的受限区域（假设在特殊/管理路径下）使用，但它的所有代码都将在主程序包中结束。

![我们所有的模块都捆绑在一个文件中](https://img.90c.vip/code/img038.png?x-oss-process=image/format,webp)

这当然不是我们想要结束的情况。我们需要一种方法只在`/admin`路由中加载这个模块。您可能已经猜到静态模块无法满足我们的需求。所有静态模块都需要在创建 Vuex Store 时注册，因此以后无法注册。

这是动态模块可以帮助我们的地方！

在创建 Vuex Store 后，可以注册与`静态模块`相反的动态模块。这个简洁的功能意味着我们不需要在应用程序初始化时下载动态模块，并且可以将其捆绑在不同的代码块中，或者在需要时懒惰地加载。

首先让我们看一下动态注册的`admin`模块以前代码的样子。

```js
// store.js
import { userAccountModule } from "./modules/userAccount";
import { adminModule } from "./modules/admin";
const store = new Vuex.Store({
  modules: {
    user: userAccountModule
  }
});
store.registerModule("admin", adminModule);
```

不是将`adminModule`对象直接传递到我们 store 的`modules`属性，而是在使用[registerModule](https://vuex.vuejs.org/api/#registermodule)方法创建 Store 之后注册它。

动态注册不需要在模块内部进行任何更改，因此可以静态或动态地注册任何 Vuex 模块。

当然，在目前的形式下，这个动态注册的模块并没有给我们任何好处。

## 适当的代码分割 Vuex 模块

让我们回到我们的问题。现在我们知道如何动态注册管理模块，我们当然可以尝试将它的代码放入`/admin` route bundle。

让我们暂时停下来简要了解我们正在使用的应用程序。

![图2](https://img.90c.vip/code/img038.png?x-oss-process=image/format,webp)

```js
// router.js
import VueRouter from "vue-router";
const Home = () => import("./Home.vue");
const Admin = () => import("./Admin.vue");
const routes = [
  { path: "/", component: Home },
  { path: "/admin", component: Admin }
];
export const router = new VueRouter({ routes });
```

在`router.js`中，我们有两个懒加载的代码分割路由。使用我们上面看到的代码，我们的`admin` Vuex 模块仍然在主`app.js`包中，因为它是`store.js`中的静态导入。

让我们解决这个问题并将此模块仅交付给输入`/admin`路由的用户，以便其他人不会下载冗余代码。

为此，我们将在`/admin`路由组件中加载`admin`模块，而不是导入并注册它`instore.js`。

```js
// store.js
import { userAccountModule } from "./modules/userAccount";
export const store = new Vuex.Store({
  modules: {
    user: userAccountModule
  }
});
// Admin.vue
import adminModule from "./admin.js";
export default {
  // other component logic
  mounted() {
    this.$store.registerModule("admin", adminModule);
  },
  beforeDestroy() {
    this.$store.unregisterModule("admin");
  }
};
```

我们来看看发生了什么！

我们正在安装后立即在`Admin.vue`（`/admin` route）中导入和注册`admin` Store。稍后在代码中，一旦用户退出管理面板，我们就会取消注册该模块，以防止同一模块的多次注册。

现在因为admin模块是在`Admin.vue`而不是`store.js`中导入的，所以它将与代码分割的`Admnin.vue`捆绑在一起！

![图3](https://img.90c.vip/code/img040.png)

>**重要说明**：如果您正在使用SSR模式，请确保在挂载的挂钩中注册模块。否则它可能导致内存泄漏，因为在服务器端没有评估beforeDestroy挂钩。

现在我们知道如何使用动态Vuex模块注册将特定于路由的模块分发到适当的包中。让我们来看看稍微复杂一些的用例。

## 延迟加载Vuex模块

假设我们在`Home.vue`上有推荐部分，我们希望对我们的服务有积极的看法。有很多这样的，所以我们不想在用户进入我们的网站后立即显示它们。只有在用户需要时才能显示它们。我们可以添加“显示推荐”按钮，点击后会加载并显示其下方的推荐。

要存储推荐数据，我们还需要一个Vuex模块。我们称之为`testimonials`。该模块将负责显示以前添加的推荐和添加新推荐。我们不需要了解实现细节。

我们希望只有用户点击按钮才能下载`testimonials`，因为之前不需要它。让我们看看如何利用动态模块注册和动态导入来实现此功能。`Testimonials.vue`是`Home.vue`中的一个组件。

![图4](https://img.90c.vip/code/img041.png?x-oss-process=image/format,webp)

让我们快速查看代码。

当用户单击`Show Testimonials`按钮时，将调用`getTestimonials（）`方法。它负责调用`getTestimonialsModule（）`来获取`testimonials.js`。一旦解决了promise（这意味着加载了模块），我们就会动态注册它并调度负责获取推荐的动作。

由于动态导入，`testimonials.js`内容被捆绑到一个单独的文件中，只有在调用`getTestimonialsModule`方法时才会下载该文件。

![图5](https://img.90c.vip/code/img042.png?x-oss-process=image/format,webp)

当我们需要退出管理面板时，我们只是在`beforeDestroy`生命周期钩子中取消注册以前注册的模块，这样如果我们再次进入这条路线就不会重复。

## 行动起来

即使静态Vuex模块注册对于大多数用例来说已足够，但在某些情况下我们可能希望使用动态注册。

- **如果只在特定路由上需要模块**，那么我们可以在适当的路由组件中动态注册它，这样它就不会在主bundle中结束。
- **如果只是在一些交互之后才需要模块**，那么我们需要以适当的方法懒惰地将动态模块注册与动态导入和加载模块相结合。

能够对分割的Vuex模块进行编码是一种强大的工具。您在应用程序中处理的与数据相关的操作越多，就可以在捆绑包大小方面节省更多成本。

在本系列的下一部分中，我们将学习如何懒加载单个组件，更重要的是，应该懒加载哪些组件。

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
