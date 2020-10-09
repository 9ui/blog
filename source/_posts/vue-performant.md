---
title: Vue中高性能组件注册模式
date: 2019-05-21 22:47:05
tags:
  - vue
  - 性能
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img003.jpg?x-oss-process=image/format,webp
# top: true
# cover: true
summary: 本章节，我们将重点关注vue性能优化之高性能组件注册。
categories: vue
---

如果您使用过Vue单个文件组件，您可能知道如何从另一个组件“调用”组件：

1. 导入子组件。
2. 将其注册在父组件的组件对象上。
3. 将组件添加到模板/渲染功能。

```js
<template>
  <some-random-thing />
</template>
<script>
import SomeRandomThing from './components/SomeRandomThing'
export default {
  components: {
    SomeRandomThing,
  },
}
</script>
```

这是一种常见的模式，最终可能会变得单调乏味。在这篇短文中，我们将学习一种模式（或两种）以避免重复。我们还将提高我们的应用程序性能。

想象一个Header组件，它包含应用程序头部的信息和布局。想象一下，这些信息可能与用户有关，也可能与公司有关，具体取决于......我不知道，这是一个设定值。随你。

现在假设我们有一个UserInfo和CompanyInfo组件。我们希望显示一个或另一个，具体取决于我们之前配置的设置值。

## 版本1：好的方式

这是我们上面概述的方式。

这可能是每个人都会想到的“默认”方式（包括我！）：

```js
<template>
  <div>
    <company-info v-if="isCompany" />
    <user-info v-else />
    ...
  </div>
</template>

<script>
import UserInfo from './components/UserInfo'
import CompanyInfo from './components/CompanyInfo'
export default {
  components: {
    UserInfo,
    CompanyInfo,
  },
  props: {
    isCompany: { type: Boolean, default: false },
  },
}
</script>
```

没有什么花里胡哨的操作。我们导入两个组件，注册它们，然后根据某个prop值显示一个或另一个。

你可能已经在这个地方使用了这种“模式”。虽然它没有任何内在错误，但我们可以做得更好。

## 版本2：动态组件`<component />`

Vue中有一个名为Component的内置组件。是的，尝试在Google上搜索。

此组件`<component />`充当另一个组件的占位符，并接受一个特殊的： `:is` prop，它应该呈现它应该呈现的组件的名称。

```js
<template>
  <div>
    <component :is="componentName" />
  </div>
</template>

<script>
import UserInfo from './components/UserInfo'
import CompanyInfo from './components/CompanyInfo'
export default {
  components: {
    UserInfo,
    CompanyInfo,
  },
  props: {
    isCompany: { type: Boolean, default: false },
  },
  computed: {
    componentName () {
      return this.isCompany ? 'company-info' : 'user-info'
    },
  },
}
</script>
```

请注意现在我们如何使用所需组件的名称创建计算值，从而删除模板中的`v-if/v-else`逻辑，以支持全能`<component />`。我们甚至可以像往常一样传递一些道具。

嗯，确实如此。但那里仍有一个重大的痛点。

我们必须导入并注册以下所有有效值：`:is` prop。我们必须导入并注册`UserInfo`和`CompanyInfo`。

只有当有人允许我们动态导入所有这些组件时，我们才不必导入和注册它们......

## 版本3：动态导入+ `<component />`（和代码分割！）

让我们看看[动态导入](https://webpack.js.org/guides/code-splitting/#dynamic-imports)和`<component />`如何一起玩：

```js
<template>
  <div>
    <component :is="componentInstance" />
  </div>
</template>

<script>
export default {
  props: {
    isCompany: { type: Boolean, default: false },
  },
  computed: {
    componentInstance () {
      const name = this.isCompany ? 'CompanyInfo' : 'UserInfo'
      return () => import(`./components/${name}`)
    }
  }
}
</script>
```

通过上面的解决方案，import会变成一个返回Promise的函数。如果Promise结算（即没有任何中断并被拒绝），它将在运行时加载所需的模块。

那么，这里发生了什么？我们仍然使用我们的新朋友`<component />`，但这次我们不是提供简单的字符串而是提供整个组件对象。什么？

如文档中所述，`:is` prop可以包含：

+ 注册组件的名称
+ 组件的选项对象

“组件的选项对象”。这正是我们所需要的！

请注意我们如何避免导入和注册组件，因为我们的动态导入是在运行时❤。

在官方文档中有关于Vue和[Dynamic Imports](https://vuejs.org/v2/guide/components-dynamic-async.html)的更多信息。

### 缺陷

请注意，我们在动态import语句之外访问我们的`prop.isCompany`。

这是强制性的，因为否则Vue无法执行其反应并在prop改变时更新我们的计算值。尝试一下，你会明白我的意思。

通过在动态导入之外访问我们的prop（通过创建一个简单的名称变量），Vue知道我们的`componentInstance`计算属性“依赖于”`this.isCompany`，因此当我们的prop更改时它将有效地触发重新评估。

使用动态导入时，Webpack将为每个匹配导入函数内表达式的文件创建（在构建时）一个块文件。

上面的例子有点人为，但想象我的/components文件夹包含800个组件。然后Webpack将创建800个块。

由于这不是我们想要的（呵呵），请确保[编写更严格的表达式](https://twitter.com/TheLarkInn/status/1025918613557981184)和/或遵循文件夹约定。例如，我倾向于将要拆分的组件分组到名为`/components/chunks`或`/components/bundles`的文件夹中，因此我知道哪些组件是Webpack拆分。

除了那些缺陷之外，我们还实现了一种惯用的模式。它带来了一个美妙的副作用，使它真正闪耀：

**我们的“条件”组件现在是代码拆分！**
如果你运行`npm run build`，你会注意到Webpack将为UserInfo.vue创建一个特定的bundle文件，而另一个用于`CompanyInfo.vue`。Webpack默认情况下会这样做。这就是Webpack魅力所在❤。

这很好，因为我们的用户在我们的应用程序请求它们之前不会加载这些包，从而减少了我们的初始包大小并提高了应用程序的性能。

[代码拆分](https://webpack.js.org/guides/code-splitting/)是麻烦。确保您熟悉它，因为如果您还没有使用它，您可以大大改善您的应用程序。去吧！

顺便说一句，您甚至可以使用[传统注释自定义动态导入](https://webpack.js.org/api/module-methods/#import-)的包名称和加载策略。

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！