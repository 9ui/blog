---
title: 构建Vue组件
date: 2019-05-18 12:54:56
tags:
  - vue
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img016.jpg?x-oss-process=image/format,webp
summary: 在本系列的这一部分中，我们将重点关注vue体系结构的原子单元---组件。
categories: vue
---

一旦你开始学习Vue，你就会发现它的体系结构的原子单元是组件。实际上，这不是特定于Vue的：任何基于组件的技术，例如React或Angular，都以相同的方式工作。

然后，您将了解有关组件以及如何构建它们的更多信息您开始创建自己的组件，组合它们并应用不同的通信模式以构建更复杂的组件。当然，你做得很好，并尽可能保持组件的小，这样你就可以在应用程序的几个地方重用它们。

但在某些时候，应用程序会增长。你有很多组件，事情开始变得混乱：很难找到合适的组件并且知道它的责任，然后可维护性开始受到影响。

不用担心，在本文中，我们将看到可用于构建应用程序组件的不同方法和技巧。

## 页面

从头开始应用程序时常见的基本结构有一个`components`文件夹，以及一个`main.js`条目文件和一个`App.vue`组件：

```js
src/
  main.js
  App.vue
  components/
```

过了一会儿，你会有几个组件。这个结构的一个非常简单的例子可能是：

```js
components/
  ArticlePage.vue
  ArticleTitle.vue
  ArticleList.vue
  AppButton.vue
  AppFooter.vue
  AppHeader.vue
  LastArticlesSection.vue
  AppList.vue
  UserPage.vue
```

>注意：Vue的样式指南多字规则告诉我们不要使用单个单词来命名组件，这就是为什么我们在前面加上“App”的前缀

在基于组件的技术中，一切都是组件。有了这样的事实，我们必须考虑一种对它们进行分类的方法。

如果您查看上面的结构，您可以轻松识别一种类型的组件：pages。因此，我们可以在放置页面组件时创建页面文件夹：

```js
components/
  ArticleTitle.vue
  ArticleList.vue
  AppButton.vue
  AppFooter.vue
  AppHeader.vue
  LastArticlesSection.vue
  AppList.vue
pages/
  ArticlePage.vue
  UserPage.vue
```

这是一个简单的拆分，已经给我们一些结构，所以当我们知道在哪里放置和搜索页面组件。

但是，页面通常由更多组件或部分组成。与`ArticlePage`相关，我们看到`ArticleTitle`，`ArticleList`和`LastArticlesSection`组件。

鉴于这些事实，将`ArticleTitle`和`LastArticlesSection`与其页面一起放在一个公共文件夹中是有意义的：

```js
components/
  ArticleList.vue
  AppButton.vue
  AppFooter.vue
  AppHeader.vue
  AppList.vue
pages/
  ArticlePage/
     index.vue
     ArticleTitle.vue
     LastArticlesSection.vue
  UserPage.vue
```

我们还将`ArticlePage.vue`重命名为`index.vue`。感谢模块解析的工作原理，当我们以这种方式导入文章页面时：

```js
import ArticlePage from "@/pages/ArticlePage"
```

它将从`pages/ArticlePage.vue`或`pages/ArticlePage/index.vue`导入。出于这个原因，我们总是可以开始将页面作为一个组件创建，然后将其移动到一个文件夹，而不必改变导入它的方式，从而使重构变得更容易。

## 公共组件

我们仍然在`components`文件夹中包含具有混合职责和域的组件。

`UI components`:件还有另一个分支点：可以在整个应用程序中重用的组件。他们只使用`props`和`events`进行通信，而不是持有任何应用程序逻辑。

在这个例子的结构中，我们看到`AppButton`和`AppList`组件是其中之一，所以让我们将它们放在ui文件夹下：

```js
components/
  ui/
    AppButton.vue
    AppList.vue
  ArticleList.vue
  AppFooter.vue
  AppHeader.vue
pages/
  ArticlePage/
    index.vue
    ArticleTitle.vue
    LastArticlesSection.vue
  UserPage.vue
```

但是，`AppFooter`和`AppHeader`组件并不完全是UI组件。相反，它们更像是(布局组件)`layout components`，因为应用程序只有一个页脚和标题。您不需要，但如果需要，可以将它们移动到布局文件夹：

```js
components/
  layout/
    AppFooter.vue
    AppHeader.vue
  ui/
    AppButton.vue
    AppList.vue
  ArticleList.vue
pages/
  ArticlePage/
    index.vue
    ArticleTitle.vue
    LastArticlesSection.vue
  UserPage.vue
```

`ArticleList`组件怎么样？我们可以拥有可在不同页面中重用的组件，因此我们不应将它们与页面组件放在一起。但是，它们属于特定域，在本例中属于`article domain`。

我们称之为(域组件)`domain components`。组织它们的一个好方法是将它们放在组件下的单独文件夹中，每个域一个文件夹：

```js
components/
  article/
    AppList.vue
  layout/
    AppFooter.vue
    AppHeader.vue
  ui/
    AppButton.vue
    AppList.vue
pages/
  ArticlePAge/
    index.vue
    ArticleTitle.vue
    LastArticlesSection.vue
  UserPage.vue
```

同样，我们可以删除Article前缀，因为路径已经具有代表性。实际上，现在我们有两个`List组件`：

```js
import ArticleList from "@/components/article/List"
import AppList from "@/components/ui/AppList"
```

最后，其他组件呢？可能存在属于无域，不是ui或布局的组件。它们可以是某种具有某种逻辑的实用程序组件，但将呈现委托给子组件。

例如，设想一个`Observer组件`，用于检测其子项何时在屏幕上相交。另一个例子是[vue-no-ssr](https://github.com/egoist/vue-no-ssr)：一个组件，只有当它在客户端上运行时才会呈现它，如果你正在应用服务器端呈现（SSR）或者你正在使用[Nuxt](https://nuxtjs.org/)。

我们可以将这种未分类的公共组件放在一个公共文件夹下：

```js
components/
  article/
    AppList.vue
  common/
    AppObserver.vue
    NoSSR.vue
  layout/
    AppFooter.vue
    AppHeader.vue
  ui/
    AppButton.vue
    AppList.vue
pages/
  ArticlePage/
    index.vue
    ArticleTitle.vue
    LastArticlesSection.vue
  UserPage.vue
```

## 行动起来

我们已经看到了构建应用程序组件的不同技术。它们可能对您有所帮助，但我希望至少您有一些可以从现在开始使用的想法。

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！