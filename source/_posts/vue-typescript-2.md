---
title: 使用Vue和Typescript创建移动Web应用程序-part2
date: 2019-05-22 20:34:06
tags:
 - vue
 - typescript
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img014.jpg?x-oss-process=image/format,webp
summary: 本章节，我们将学习如何使用Vue，Vuetify和Typescript创建移动Web应用程序 - 第2部分。
categories: vue
---

我们将进一步开发我们的新闻应用程序，以显示来自服务器数据的新闻文章列表，并使用Vuex进行状态管理。

![图1](https://img.90c.vip/code/img079.gif?x-oss-process=image/format,webp)

本文是本期的第二部分。如果您还没有阅读第一部分，我建议您从那里开始回来。

在第二部分中，我们将看到如何使用Vuetify卡组件，并了解如何将Vuex与模块配合使用。

GitHub repo上提供了本文的代码：[https://github.com/JonUK/vuetify-mobile-app](https://github.com/JonUK/vuetify-mobile-app)

## 新闻列表组件

我们为新闻应用程序准备了应用程序shell，现在我们需要实现显示新闻文章列表。为了帮助可视化我们想要UI的外观，我使用Adobe XD创建了一个低保真设计（免费版本可用）。我还使用了Great Simple Studio的免费版[Android GUI](https://materialdesignkit.com/android-gui/)设计套件，从一系列设计元素开始。

![图2](https://img.90c.vip/code/img080.png?x-oss-process=image/format,webp)

通过[Vuetify UI组件](https://vuetifyjs.com/en/components/cards)，我们可以在我们的新闻文章列表中显示每个项目。Vuetify有一个使用Flexbox的12点网格系统，所以对于每张卡，让我们在左侧分配9列用于新闻文章标题和日期字符串，并在右边的3列用于文章缩略图。

在文件夹`src/components`文件夹中创建名为`NewsList.vue`的Vue单文件组件（SFC）。

```js
<template>
  <div>

    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs9>
                  <div>
                    <div class="subheading font-weight-medium">
                      Vue.js is the absolute rockstar of the JavaScript ecosystem
                    </div>
                    <div>Jan 22 2019</div>
                  </div>
                </v-flex>
                <v-flex xs3>
                  <v-img
                    contain
                    src="/thumbnails/winner.png"
                    srcset="/thumbnails/winner.png 1x,
                            /thumbnails/winner@2x.png 2x"
                    height="72px"
                    transition="false"
                  ></v-img>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>

      </v-layout>
    </v-container>

  </div>
</template>
```

该组件包含单个“硬编码”新闻文章的标记。稍后我们将回到此组件并使用来自服务器的数据动态填充它。在此之前，让我们通过查看它在不同移动设备视口宽度下呈现的方式来检查组件是否响应。

![图3](https://img.90c.vip/code/img081.gif?x-oss-process=image/format,webp)

该布局在典型的移动电话上运行良好，宽度为375个独立设备像素（DIP），即使低至320 DIP也看起来合理，因此我们可以确保我们的应用在各种移动电话设备上看起来都很好。

在v-img组件上，我们设置了srcset属性，以提供相同图像的不同大小版本，以匹配不同的像素密度设备。高像素密度设备将以相同的分配大小下载并显示较大的图像，因此看起来很漂亮和清晰。在低像素密度设备上，我们不会使用较大的图像浪费用户的带宽，而是浏览器将下载正常大小的图像。

## 服务器数据

我们的组件在视觉上已准备就绪，但仍需要从服务器提供数据。让我们创建一个接口`NewsArticle`，它将作为新闻列表组件所需数据的合同，并创建相关的枚举`ArticleType`。这两个定义都将进入一个新文件s`rc/types.ts`。

```js
export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  dateString: string;
  baseImageName: string;
  articleType: ArticleType;
  isFavourite: boolean;
}

export enum ArticleType {
  TopStory = 'TOP_STORY',
  CodeExample = 'CODE_EXAMPLE'
}
```

我们可以从新闻列表组件中的代码中检索服务器数据，但这会给组件带来额外的责任，除了可视化显示数据之外，还可能阻碍该组件与不同数据源的重用。让组件检索它自己的数据在单元测试组件时也会增加额外的复杂性。出于这些原因，我们将通过新服务从服务器检索数据。创建一个新文件夹`src/services`并在里面创建文件`newsService.ts`。

```js
import { ArticleType, NewsArticle } from '../types';

class NewsService {

  getArticlesByType(articleType: ArticleType): Promise<NewsArticle[]> {

    return fetch('/data/articles.json')
      .then((response) => {
        return response.json();
      })
      .then((serverArticles) => {

        const newsArticles = serverArticles
          .filter((serverArticle: any) => serverArticle.articleType === articleType)
          .map((serverArticle: any) => {
            return {
              id: serverArticle.id,
              title: serverArticle.title,
              content: serverArticle.content,
              dateString: serverArticle.dateString,
              baseImageName: serverArticle.baseImageName,
              articleType: serverArticle.articleType,
              isFavourite: serverArticle.isFavourite
            } as NewsArticle;
          });

        return newsArticles;
      });
  }
}

export default new NewsService();
```

方法`getArticlesByType`从静态JSON文件`/data/articles.json`中检索所有文章，将它们过滤到给定`ArticleType`的文章，然后将服务器数据映射到满足接口`NewsArticle`的对象的实例。在实际应用程序中，我们希望服务器端代码对结果进行排序，过滤和限制，而不是在客户端进行，但我们不会在本文中关注服务器端代码。

让我们使用热门故事视图组件中的新闻服务来检索新闻文章，并通过道具将它们传递给新闻列表组件。

```js
<template>

  <div>
    <NewsList :newsArticles="newsArticles"></NewsList>
  </div>

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import newsService from '../services/newsService';
  import NewsList from '../components/NewsList.vue';
  import { ArticleType, NewsArticle } from '../types';
  @Component({
    components: {
      NewsList
    }
  })
  export default class TopStories extends Vue {
    newsArticles: NewsArticle[] = [];
    mounted() {
      newsService.getArticlesByType(ArticleType.TopStory)
        .then((newsArticles: NewsArticle[]) => {
          this.newsArticles = newsArticles;
        });
    }
  }
</script>
```

我们需要将`newsArticles prop`添加到新闻列表组件以接收文章。npm包`vue-property-decorator`（已经安装了Vue CLI）通过提供@Props装饰器为Vue道具提供了改进的TypeScript支持。让我们在新闻列表组件中使用这个装饰器。

```js
<template>
  <div>

    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 v-for="newsArticle in newsArticles" :key="newsArticle.id">
          <v-card>
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs9>
                  <div>
                    <div class="subheading font-weight-medium">
                      {{ newsArticle.title }}
                    </div>
                    <div>{{ newsArticle.dateString }}</div>
                  </div>
                </v-flex>
                <v-flex xs3>
                  <v-img
                    contain
                    :src="`/thumbnails/${newsArticle.baseImageName}.png`"
                    :srcset="`/thumbnails/${newsArticle.baseImageName}.png 1x,
                             /thumbnails/${newsArticle.baseImageName}@2x.png 2x`"
                    height="72px"
                    transition="false"
                  ></v-img>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>

      </v-layout>
    </v-container>

  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { NewsArticle } from '../types';
  @Component
  export default class NewsList extends Vue {
    @Prop({required: true}) newsArticles!: NewsArticle[];
  }
</script>
```

属性名称后面的感叹号（例如newsArticles！）向TypeScript编译器指示虽然它不会在我们的代码中看到属性被设置为值，但是它应该放松并且不要担心值是未定义的，因为它将被设定。在我们的例子中，Vue在创建组件时提供值。

我们现在有一个顶级故事视图组件，用于检索和显示新闻文章。

![图4](https://img.90c.vip/code/img082.png?x-oss-process=image/format,webp)

我们可以以类似的方式更新代码示例和喜欢的视图组件，以通过新闻服务检索新闻文章，并使用新闻列表组件来呈现文章。

## 顶部工具栏标题

当用户在不同的底部导航菜单项之间导航时，如果顶部工具栏标题已更改以反映当前选定的菜单项，那将是很好的。为实现这一目标，我们将：

+ 为每个包含工具栏标题的路径添加一些元数据
+ 在路线更改时，更新Vuex商店中的工具栏标题
+ 在顶部工具栏组件中，从Vuex商店渲染工具栏标题

让我们从寻找`Vuex store`开始吧。Vuex支持将存储分隔为不同的模块，这有助于保持代码组织并允许将相关状态组合在一起。虽然我们的州要求目前非常基础，但我们仍将使用`Vuex store`模块。对于大多数非平凡的项目，您可能会从`Vuex store`模块中受益，因此很高兴看到如何使用它们。

首先，我们将在文件`types.ts`中定义根状态和顶部工具栏状态的类型。

```js
// Store root state
export interface RootState {
  topToolbar: TopToolbarState;
}

// Store modules state
export interface TopToolbarState {
  title: string;
}
```

我们现在将在文件夹`src/store/modules`中创建顶部工具栏Vuex stores模块`topToolbar.ts`。

```js
import { ActionTree, Module, MutationTree, GetterTree } from 'vuex';
import { TopToolbarState, RootState } from '../../types';

const state: TopToolbarState = {
  title: 'Top Stories',
};

export const getters: GetterTree<TopToolbarState, RootState> = {
  title: (theState: TopToolbarState) => {
    return theState.title;
  }
};

const mutations: MutationTree<TopToolbarState> = {
  setTitle(theState: TopToolbarState, title: string) {
    theState.title = title;
  },
};

export const actions: ActionTree<TopToolbarState, RootState> = {
  changeTitle({commit}, title: string) {
    commit('setTitle', title);
  },
};

export const topToolbar: Module<TopToolbarState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
```

顶部工具栏存储模块包含操作`changeTitle`，后者又调用突变`setTitle`。该模块还包含getter标题。在我们创建Vuex存储模块时，我们将设置`namespaced：true`，这将使我们的操作，突变和getter保持在全局命名空间之外。

我们现在需要将顶部工具栏存储模块与`Vue CLI`为我们创建的现有存储连接起来。将`store.ts`移动到文件夹`src/store`并进行以下更改。

```js
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '../types';

import { topToolbar } from './modules/topToolbar';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    topToolbar
  }
};

export default new Vuex.Store<RootState>(store);
```

现在在路由器中，我们将更新顶部工具栏存储并在每个路径导航期间设置标题。

```js
import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';

import TopStories from './views/TopStories.vue';
import CodeExamples from './views/CodeExamples.vue';
import MyFavorites from './views/MyFavorites.vue';

Vue.use(Router);

class RouteMeta {
  title: string;

  constructor({title}: { title: string }) {
    this.title = title;
  }
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'top-stories',
      component: TopStories,
      meta: new RouteMeta({ title: 'Top Stories' })
    },
    {
      path: '/code-examples',
      name: 'code-examples',
      component: CodeExamples,
      meta: new RouteMeta({ title: 'Code Examples' })
    },
    {
      path: '/my-favorites',
      name: 'my-favorites',
      component: MyFavorites,
      meta: new RouteMeta({ title: 'Favorites' })
    }
  ]
});

// This callback runs before every route change, including on initial load
router.beforeEach((to, from, next) => {

  const routeMeta = to.meta as RouteMeta;
  store.dispatch('topToolbar/changeTitle', routeMeta.title);
  next();
});

export default router;
```

每个路由都有一个与之关联的`RouteMeta`对象，该对象包含title属性。在`router.beforeEach`中，我们拦截每个路由更改，获取路由的元数据，然后使用命名空间`topToolbar`调用顶部工具栏操作`changeTitle`。函数调用`next`让Vuex知道继续进行导航。

最后一步是使用顶部工具栏Vuex store中的标题getter在顶部工具栏组件中显示标题。npm包vuex-class通过提供`@Getter`装饰器为Vuex getter提供改进的TypeScript支持。Vue CLI尚未安装此软件包，因此我们将自行安装。

```js
npm install vuex-class --save
```

我们现在可以使用`@Getter`装饰器和顶部工具栏组件中的顶部工具栏标题getter来显示标题。


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

      <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>

    </v-toolbar>

  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Getter } from "vuex-class";
  @Component
  export default class TopToolbar extends Vue {
    @Getter("title", {namespace: "topToolbar"}) title!: string;
    showMenu: boolean = false;
    toggleMenu(): void {
      this.showMenu = !this.showMenu;
    }
  }
</script>
```

退后一步，拍拍自己的背部！移动Web应用程序正在形成良好的状态。

![图5](https://img.90c.vip/code/img083.png?x-oss-process=image/format,webp)

GitHub repo上提供了本文的代码：[https://github.com/JonUK/vuetify-mobile-app](https://github.com/JonUK/vuetify-mobile-app)

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！