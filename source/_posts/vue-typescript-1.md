---
title: 使用Vue和Typescript创建移动Web应用程序-part1
date: 2019-05-22 19:16:52
tags:
 - vue
 - typescript
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img014.jpg?x-oss-process=image/format,webp
summary: 本章节，我们将学习如何使用Vue，Vuetify和Typescript创建移动Web应用程序 - 第1部分。
categories: vue
---

本文介绍如何使用Vue生态系统中的一系列工具从头开始创建移动Web应用程序。我们要创建的虚拟应用程序是一个新闻应用程序。

![图1](https://img.90c.vip/code/img070.gif)

我们将使用`Vuetify`作为素材设计组件，使用`Vue Router`来处理导航。代码将用`TypeScript`编写。

本文的第1部分将介绍如何创建应用程序shell。在以后的文章中，我们将构建更多功能，并利用`Jest`和`Vue Test Utils`编写单元测试。

GitHub repo上提供了本文的代码：[https://github.com/JonUK/vuetify-mobile-app](https://github.com/JonUK/vuetify-mobile-app)

## 创建项目

所以，不用多说，让我们创建我们的项目。我们将使用`Vue CLI 3`，因此首先要确保已安装。

```js
npm install -g @vue/cli
```

然后我们可以使用`Vue CLI`来创建我们的项目。

```js
vue create vuetify-mobile-app
```

Vue CLI将指导我们创建新项目并向我们提出一些问题。我们将手动选择功能，确保我们包括`Babel`，`TypeScript`，`Router`，`Vuex`和 `Unit Testing`：

![图2](https://img.90c.vip/code/img071.png?x-oss-process=image/format,webp)

对于其他选项，我们将使用除单元测试解决方案之外的默认值，我们将选择`Jest`。

![图3](https://img.90c.vip/code/img072.png?x-oss-process=image/format,webp)

此时，Vue CLI将实现它的魔力并为我们创建项目并安装所有npm依赖项。从这里，我们可以从新项目目录运行网站。

```js
cd vuetify-mobile-app
npm run serve
```

在浏览器中访问`http//localhost8080/`显示我们的网站它的全部！

![图4](https://img.90c.vip/code/img073.png?x-oss-process=image/format,webp)

## 安装Vuetify

Vuetify是一个出色的组件框架，它允许我们通过将几个现有组件组合在一起来创建一个外观漂亮的应用程序。我们将Vuetify安装为插件。

```js
vue add vuetify
```

现在如果我们运行网站，我们就会看到有一个美丽的Vuetify网站！

![图5](https://img.90c.vip/code/img074.png?x-oss-process=image/format,webp)

在安装Vuetify之后，我需要做一些linting修复，并对Vuetify的引用进行了调整。这些故障可能会在您阅读本文时解决，但如果遇到问题，您可以看到我必须做出的更改。[https://github.com/JonUK/vuetify-mobile-app/commit/aef8d5cc9ec81fcd1ab23f56703ee7373087b227](https://github.com/JonUK/vuetify-mobile-app/commit/aef8d5cc9ec81fcd1ab23f56703ee7373087b227)

## 顶部工具栏组件

我们要创建的第一个组件是一个工具栏组件，用于显示在应用程序的顶部。

![图6](https://img.90c.vip/code/img075.png?x-oss-process=image/format,webp)

在文件夹`src/components`文件夹中创建一个名为`TopToolbar.vue`的Vue单文件组件（SFC）。

```js
<template>
  <div>

    <v-navigation-drawer app fixed v-model="showMenu">
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Help</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>


    <v-toolbar fixed app dark color="primary">

      <v-toolbar-side-icon @click.stop="toggleMenu"></v-toolbar-side-icon>

      <v-toolbar-title class="white--text">Vue News</v-toolbar-title>

    </v-toolbar>

  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class TopToolbar extends Vue {
    showMenu: boolean = false;
    toggleMenu(): void {
      this.showMenu = !this.showMenu;
    }
  }
</script>
```

我们基本上将Vuetify工具栏和导航抽屉组件包装在我们自己的组件中。“hamburger菜单”图标切换导航抽屉的显示，其中包含两个虚拟条目“设置”和“帮助”以及相应的图标。

[图7](https://img.90c.vip/code/img076.png?x-oss-process=image/format,webp)

在TypeScript代码中，我们定义类TopToolbar并使用`@Component`装饰器来指示该类是Vue组件。该类包含属性`showMenu`，它被键入布尔值。与Vue一起使用JavaScript时，这相当于数据对象属性。该类还包含`toggleMenu`隐藏和显示导航抽屉的方法。

在模板中，属性app和fixed确保工具栏显示为应用程序布局的一部分（而不是一般内容的一部分），这意味着我们的工具栏将显示在视口的顶部。

v工具栏组件包含`color =“primary”`属性，该属性将工具栏设置为Vuetify主题主色，默认为蓝色。有关主题的更多信息，请参见Vuetify文档站点。[https://vuetifyjs.com/en/framework/theme](https://vuetifyjs.com/en/framework/theme)

Vuetify使用包含所有Material Design图标的字体文件。可以在Google Material Design网站上找到所有可用的Material Design图标及其名称。[https://material.io/tools/icons](https://material.io/tools/icons)

将图标名称放在`<v-icon></ v-icon>`标记内是显示图标所需的全部内容。

在创建Vue组件时，最好始终使用两个或更多单词作为组件名称。这将阻止您创建与现有和未来HTML元素冲突的组件。[https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential](https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential)

## 底部导航组件

我们将在我们的应用程序中使用的主要导航是底部导航菜单。将主导航放置在屏幕底部非常适合移动应用，因为只需单手和单拇指互动即可轻松触及菜单。

[图8](https://img.90c.vip/code/img077.png?x-oss-process=image/format,webp)

在文件夹`src/components`文件夹中创建名为`BottomNav.vue`的文件。

```js
<template>

  <v-bottom-nav app fixed :active.sync="activeItem" :value="true">
    <v-btn flat color="primary" value="top">
      <span>Top Stories</span>
      <v-icon>thumb_up</v-icon>
    </v-btn>

    <v-btn flat color="primary" value="code">
      <span>Code Examples</span>
      <v-icon>code</v-icon>
    </v-btn>

    <v-btn flat color="primary" value="favorites">
      <span>Favorites</span>
      <v-icon>favorite</v-icon>
    </v-btn>

  </v-bottom-nav>

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class BottomNav extends Vue {
    activeItem: string = 'top';
  }
</script>
```

这定义了我们的应用程序中的三个菜单项“Top Stories”，“Code Examples”和“Favorites”。属性app和fixed再次表示底部导航是应用程序布局的一部分，这意味着它将显示在视口的底部。

目前，更改活动菜单项不会执行任何操作。稍后我们将重新访问此组件并使用路由器实现导航。

## 创建应用程序Shell

现在我们已经创建了TopToolbar和BottomNav组件，让我们实际在`App.vue`中使用它们。

```js
<template>
  <v-app>

    <TopToolbar></TopToolbar>

    <BottomNav></BottomNav>

  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import TopToolbar from './components/TopToolbar.vue';
  import BottomNav from './components/BottomNav.vue';
  @Component({
    components: {
      TopToolbar,
      BottomNav
    }
  })
  export default class extends Vue {
  }
</script>
```

现在，当我们查看网站时，我们可以看到我们正在运行的两个新组件。

[图9](https://img.90c.vip/code/img078.png?x-oss-process=image/format,webp)

请注意，所有Vuetify组件都必须包含在`v-app`组件中，才能呈现并正确运行。

## 添加视图组件

我们的应用程序开始很好地形成，但我们仍然没有任何内容来显示用户，因为他们浏览底部导航菜单项。在项目中，我们有文件夹`src/views`，这是我们放置充当视图并导航到的组件的位置。

```js
<template>

  <v-container>
    <h1 class="headline">[[Top Stories]]</h1>
    Content is coming to this mobile app very soon!
  </v-container>

</template>
```

我们不需要这些组件包含任何代码，因此我们可以安全地省略`<script></script>`标记。

我们现在需要更新路由器，以便它知道每个组件并创建一个路径，其中包含每个视图组件的路径和名称。

```js
import Vue from 'vue';
import Router from 'vue-router';

import TopStories from './views/TopStories.vue';
import CodeExamples from './views/CodeExamples.vue';
import MyFavorites from './views/MyFavorites.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'top-stories',
      component: TopStories
    },
    {
      path: '/code-examples',
      name: 'code-examples',
      component: CodeExamples
    },
    {
      path: '/my-favorites',
      name: 'my-favorites',
      component: MyFavorites
    }
  ]
});
```

现在路由到位，让我们更新BottomNav组件，以便每个项目引用路由器中的路由。

```js
<template>

  <v-bottom-nav app fixed :value="true">

    <v-btn flat color="primary" :to="{ path: '/'}">
      <span>Top Stories</span>
      <v-icon>thumb_up</v-icon>
    </v-btn>

    <v-btn flat color="primary" :to="{ name: 'code-examples'}">
      <span>Code Examples</span>
      <v-icon>code</v-icon>
    </v-btn>

    <v-btn flat color="primary" :to="{ name: 'my-favorites'}">
      <span>Favorites</span>
      <v-icon>favorite</v-icon>
    </v-btn>

  </v-bottom-nav>

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class BottomNav extends Vue {
  }
</script>
```

我更喜欢按名称引用路由，因为这为您提供了以后更改路由结构的灵活性。当按名称引用根路径路径时，我遇到了一个问题，即菜单项始终呈现为活动状态，因此我切换到引用此菜单项的路径路径。

最后一步是更新`App.vue` `<template></template>`以添加`<router-view> </router-view>`标记，该标记用作呈现当前路由的视图组件的目标。

```js
<template>
  <v-app>

    <TopToolbar></TopToolbar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <BottomNav></BottomNav>

  </v-app>
</template>
```

恭喜！新闻应用程序现在使用路由器在不同的视图组件之间导航。你必须立即停止并庆祝你的疯狂技能！

GitHub repo上提供了本文的代码：[https://github.com/JonUK/vuetify-mobile-app](https://github.com/JonUK/vuetify-mobile-app)

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！