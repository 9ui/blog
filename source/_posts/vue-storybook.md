---
title: storybook与Nuxt.js一起使用的综合指南
date: 2019-05-20 21:59:00
tags:
  - vue
  - nuxt
# cover: true
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img005.jpg?x-oss-process=image/format,webp
summary: 本章节，我们将重点关注storybook与Nuxt.js一起使用。
categories: vue
---

对于那些不知道的人，Storybook 是一个独立开发 UI 组件的开源工具。查看其[用例](https://storybook.js.org/use-cases/)。

将 Storybook 与普通的 Vue.js 一起使用并不麻烦，但它是 Nuxt 的另一个story，因为它不能直接使用。那里的信息是分散的，我不得不挖掘其他人的回购和例子，让它与 Nuxt 合作，包括我通常如何使用Store。

我以为我会把它写下来并为那些想要开始使用带有 Nuxt 的 Storyboook 的其他人创建一个更强大的示例存储库。

我通常的项目设置包括使用`Vuex store`，`Nuxt Axios模块`，`TailwindCSS`和`自定义SCSS`。

这大致是我希望看到与 Storybook 一起工作，而不必过多地改变我对 Nuxt 的使用方式。

在本示例的最后，我们将有一个 List 组件，可以从[JSONPlaceholder](https://jsonplaceholder.typicode.com/)外部加载数据。

看看它在[这里](https://strybook-nuxt-demo.netlify.com/?path=/story/*)会是什么样子。

这是一个广泛的指南，所以请随意跳到您正在寻找的部分。你可以在[这里](https://github.com/mstrlaw/nuxt-storybook)获取所有这些代码。

## 内容

- **Setup initial Nuxt project** - 使用 npx 定期安装 Nuxt;
- **Adding Storybook to Nuxt**  - Storybook 的基本安装和设置;
- **Creating a Story** - 我们的第一个例子 Story;
- **Adding a Store to the project** - 添加 Vuex 并使用其他组件增强示例组件并进行 API 调用（尚未使用 Store with Storybook）;
- **Handling Storybook Issues**

> 1. 别名
> 2. CSS/SCSS
> 3. `<nuxt-link>`标签

- **Using Vuex with Storybook** - 将 Vuex 添加到我们的Story并重新使用
- **Deploying it to Netlify** - 分享给您的团队和客户;

## 初始设置

因为本指南是从头开始的，所以我们首先使用`create-nuxt-app` 创建一个新的 Nuxt 项目：

```js
npx create-nuxt-app nuxt-storybook
```

此外，我们将更新 Nuxt 到它的最新稳定版本 2.5.1：

```js
npm rm nuxt && npm i -S nuxt
```

**构建错误?**

在撰写本文时，升级到 Nuxt 2.5 会导致构建时出错：

```js
ERROR  Failed to compile with 1 errors
friendly-errors 13:29:07
[...]
Module parse failed: Unexpected token (7:24)
friendly-errors 13:29:07
[...]
|
| var _0c687956 = function _0c687956() {
>   return interopDefault(import('../pages/index.vue'
|   /* webpackChunkName: "pages/index" */
|   ));
```

如果仍然如此，基于此[解决](https://github.com/nuxt/nuxt.js/issues/4839#issuecomment-458666603)方法，以下内容适用于我的机器™（macOS）：

```js
rm -rf node_modules package-lock.json
npm i -D webpack@4.28.4
npm i
```

运行`npm run dev`现在应该显示默认的Nuxt欢迎页面

## 添加 Storybook

我们将根据他们的[Vue指南](https://storybook.js.org/docs/guides/guide-vue/)手动安装`Storybook`和必要的依赖项。由于Nuxt，大多数依赖项已经存在，`babel-preset-vue`是唯一缺失的。

```js
// Add Storybook & dependencies
npm i -D @storybook/vue babel-preset-vue
```

现在创建一个名为`.storybook`的文件夹，并在其中添加文件`config.js`。

`Config.js`用作“入口点”，告诉Storybook在哪里查找和加载Story，以及导入和使用其他必要的插件或插件与Story一起使用。

遵循[Vue准则](https://storybook.js.org/docs/guides/guide-vue/)，`config.js`最初看起来像这样：

```js
// /.storybook/config.js
import { configure } from '@storybook/vue';
function loadStories() {
  const req = require.context('../stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}
configure(loadStories, module);
```

它正在做的是迭代文件中Story以`.stories.js`结尾的每个文件。因为我喜欢将我的Story放在我的组件附近而不是全部放在Story文件夹中，我只需将文件夹更改为组件，然后让该函数遍历其中的每个文件夹。

我们稍后会回到config.js。现在让我们确保Story能够加载一个简单的Story并显示它。

## 添加第一个 Story

在组件目录中，创建一个名为list的新文件夹，并在其中创建一个名为`List.vue`的文件，其中包含以下代码。我们将使用它来构建我们的最终组件。

```js
// /components/list/List.vue
<template>
  <div class="list">
    I'm a list
  </div>
</template>
<script>
  export default {
    name: 'List'
  }
</script>
<style scoped>
  .list {
    background: #CCC;
  }
</style>
```

没什么，只是让我们的Story显示的东西。现在在同一文件夹中添加一个名为`List.stories.js`的文件，其中包含以下代码：

```js
// /components/list/List.stories.js
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import List from './List'
storiesOf('List', module)
  .add('As a component', () => ({
    components: { List },
    template: '<List />'
  }))
  .add('I don\'t work', () => '<List />')
```

现在要启动`Storybook`，我们需要将运行脚本添加到`package.json`（在不同的端口上运行它，添加`-p <port-number>）`

```js
“storybook”: “start-storybook”
```

在终端输入 `npm run storybook`，浏览器将打开一个新选项卡：

![Our first stories! But only one works?](/images/code/img045.gif)

这是Story的运行。而且因为它使用热重新加载，您将能够立即看到您的更改。

注意第二个Story不起作用？那是因为我们没有告诉Storybook使用我们的List组件来实现第一个Story（打开浏览器控制台会显示这些错误）。

我们可以将List作为一个全局组件注册，就像我们使用Nuxt的插件注册它们一样，只在config.js中，所以最终看起来像：

```js
// /.storybook/config.js
import { configure } from '@storybook/vue';
import Vue from 'vue'
import List from '../components/list/List.vue'
Vue.component('List', List)
function loadStories() {
  const req = require.context('../components', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}
configure(loadStories, module);
```

现在第二个Story有效。这只是为了让您了解某些组件可能会使用其他组件。为了避免总是导入这些，我们可以像我们一样全局定义它们（剩下的例子不会使用它，所以你可以删除它）。

你现在有一个使用Nuxt的Storybook的香草设置。但这还不是一个Story。

## 增强我们的列表组件和添加Store

首先，我们将为我们的列表添加一些复杂性，并担心Storybook稍后会引发错误。

清单应该：

+ 安装后 - 使用JSONPlaceholder获取假用户或虚假评论;
+ 迭代每个用户/注释并使用ListItem组件呈现它;
+ 利用Vuex发送我们的API调用;
+ 看起来更漂亮，使用TailwindCSS和一些自定义样式;

### 样式

 对于样式，我们将使用一些TailwindCSS实用程序类以及一些自定义样式来举例说明它与Storybook的用法。我使用SCSS，所以我们需要添加通常的`node-sass`和`sass-loader`：

```js
 npm i -D node-sass sass-loader
 ```

List将接受prop源，因此它知道我们想要获取哪个数据源。我们还准备好在我们构建这些调用之后调用足够的Store操作来执行API调用。

```js
// /components/list/List.vue
<template>
  <div class="list p-5 rounded">
    I'm a {{ source }} list
  </div>
</template>
<script>
  export default {
    name: 'List',
    props: {
      source: {
        type: String,
        default: 'users'
      }
    },
    data() {
      return {
        entities: []
      }
    },
    mounted() {
      switch (this.source) {
        default:
        case 'users':
          this.loadUsers()
          break
        case 'comments':
          this.loadComments()
          break
      }
    },
    methods: {
      loadUsers() {
        //  Will call store action
        console.log('load users')
      },
      loadComments() {
        //  Will call store action
        console.log('load comments')
      },
    }
  }
</script>
<style lang="scss" scoped>
  $background: #EFF8FF;
  .list {
    background: $background;
  }
</style>
```

### 添加Store和API调用

我通常会在Store的操作中保留我的API调用，因此我可以使用来轻松调用它们。`this.$store.dispatch`。

**.env：**我们将端点保存在.env文件中，因此为了获得这些值，我们将安装`@nuxtjs/dotenv`模块`npm i -S @nuxtjs/dotenv`并将其添加到`nuxt.config.js`中模块。

在项目的根文件中创建.env并添加：

>USERS_ENDPOINT=[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)
>COMMENTS_ENDPOINT=[https://jsonplaceholder.typicode.com/comments](https://jsonplaceholder.typicode.com/comments)

添加Store操作以检索用户和注释。使用以下代码在现有商店目录下添加`actions.js`文件：

```js
// /store/actions.js
export default {
  async GET_USERS({ }) {
    return await this.$axios.$get(`${ process.env.USERS_ENDPOINT }`)
  },
  async GET_COMMENTS({ }) {
    return await this.$axios.$get(`${ process.env.COMMENTS_ENDPOINT }`)
  },
}
```

我们现在可以修改List组件的方法，以便在挂载时调用这些操作，最终看起来像：

```js
// /components/list/List.vue
<template>
  <div class="list p-5 rounded">
    I'm a {{ source }} list
  </div>
</template>
<script>
  export default {
    name: 'List',
    props: {
      source: {
        type: String,
        default: 'users'
      }
    },
    data() {
      return {
        entities: []
      }
    },
    mounted() {
      switch (this.source) {
        default:
        case 'users':
          this.loadUsers()
          break
        case 'comments':
          this.loadUsers()
          break
      }
    },
    methods: {
      loadUsers() {
        this.$store.dispatch('GET_USERS')
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log('API error')
          console.log(err)
        })
      },
      loadComments() {
        this.$store.dispatch('GET_COMMENTS')
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log('API error')
          console.log(err)
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  // Pointless. Just for the sake of the example
  $background: #EFF8FF;
  .list {
    background: $background;
  }
</style>
```

我们现在从每个端点返回一组数据。让我们来展示它们。

### 添加ListItem组件

根据我们是否列出用户或评论，我们将显示`ListItem`组件的变体。每个变体也都有自己的组件。

在名为items的列表下创建一个文件夹，并创建一个名为`ListItem.vue`的文件。这是要添加到其中的代码：

```js
// /components/list/items/ListItem.vue
<template>
  <div class="list-item rounded bg-blue-light px-5 py-3">
    <div v-if="itemType === 'users'">
      A user item
    </div>
    <div v-else>
      A comment item
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ListItem',
    props: {
      itemType: {
        type: String,
        default: 'user'
      },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    }
  }
</script>
```

现在没什么，我们马上就会改变它。与此同时，我设置了主页的样式，以便我们可以并排看到两个列表：

![主页显示2个并排列表](https://img.90c.vip/code/img054.png?x-oss-process=image/format,webp)

现在让我们实际使用我们的ListItem组件来迭代我们的API返回的每个实体并相应地设置它。

## 添加用户和评论组件

我们将根据以下数据结构为每个实体创建一个组件：

```js
// User
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
// Comment
{
  "postId": 1,
  "id": 1,
  "name": "id labore ex et quam laborum",
  "email": "Eliseo@gardner.biz",
  "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
}
```

使用以下代码在`/components/list/items/`中添加`Comment.vue`文件：

```js
// /components/list/items/Comment.vue
<template>
  <div>
    <b>{{ name }}</b>
    <p>{{ body }}</p>
  </div>
</template>
<script>
  export default {
    name: 'Comment',
    props: {
      name: {
        type: String,
        default: ''
      },
      body: {
        type: String,
        default: ''
      }
    }
  }
</script>
```

使用以下代码在`/components/list/items/`中添加`User.vue`文件：

```js
// /components/list/items/User.vue
<template>
  <div>
   <nuxt-link
      :to="{ name:'user' }"
      class="text-lg"
    >
      {{ name }} - "{{ username }}"
    </nuxt-link>
    <div class="flex flex-wrap justify-start my-2">
      <div class="w-1/2 mb-2">
        <span class="text-grey-dark font-bold">Email</span>
        <p class="p-0 m-0">{{ email }}</p>
      </div>
      <div class="w-1/2 mb-2">
        <span class="text-grey-dark font-bold">Phone</span>
        <p class="p-0 m-0">{{ phone }}</p>
      </div>
      <div class="w-1/2 mb-2">
        <span class="text-grey-dark font-bold">City</span>
        <p class="p-0 m-0">{{ address.city }}</p>
      </div>
      <div class="w-1/2 mb-2">
        <span class="text-grey-dark font-bold">Company</span>
        <p class="p-0 m-0">{{ company.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'User',
    props: {
      name: {
        type: String,
        default: ''
      },
      username: {
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      phone: {
        type: String,
        default: ''
      },
      address: {
        type: Object,
        default: () => {
          return {}
        }
      },
      company: {
        type: Object,
        default: () => {
          return {}
        }
      }
    }
  }
</script>
```

>注意：为了示例，我添加了一个`nuxt-link`。为此，我们还添加了相应的页面`/pages/user/index.vue`。它没有任何东西，只是为了链接到某处的`nuxt-link`。

让我们更改ListItem组件以使用这些新组件：

```js
// /components/list/items/ListItem.vue
<template>
  <div class="list-item rounded bg-indigo-lightest shadow px-5 py-3 mb-3">
    <div v-if="itemType === 'users'">
      <User
        :name="data.name"
        :username="data.username"
        :email="data.email"
        :phone="data.phone"
        :address="data.address"
        :company="data.company"
      />
    </div>
    <div v-else>
      <Comment
        :name="data.name"
        :body="data.body"
      />
    </div>
  </div>
</template>
<script>
  import User from '@/components/list/items/User'
  import Comment from '@/components/list/items/Comment'
export default {
    name: 'ListItem',
    components: {
      User,
      Comment
    },
    props: {
      itemType: {
        type: String,
        default: 'user'
      },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    }
  }
</script>
```

最后，我们需要更改List.vue，以便我们实际将API调用的响应作为props传递，而不是仅仅记录它。更改方法，使其看起来像：

```js
// /components/list/List.vue
[...]
methods: {
  loadUsers() {
    this.$store.dispatch('GET_USERS')
    .then(res => {
      this.entities = res.data
    })
    .catch(err => {
      console.log('API error')
      console.log(err)
    })
  },
  loadComments() {
    this.$store.dispatch('GET_COMMENTS')
    .then(res => {
      this.entities = res.data
    })
    .catch(err => {
      console.log('API error')
      console.log(err)
    })
  },
}
[...]
```

经过一些小的风格调整，现在应该是这样的：

![Amazing Design®](https://img.90c.vip/code/img055.gif?x-oss-process=image/format,webp)

我们现在准备转到故事书，看看会发生什么。

## 解决Story的问题

我们现在在运行Storybook时解决每个引发的问题，第一个是：

### 找不到模块

>Error: Can’t resolve ‘@/components/list/items/ListItem’

如果你看一下Storybook的例子，你会看到它使用相对路径引用组件。对于我们使用Nuxt来说这是一个问题，因为框架使用了@alias。

我们现在需要在所有地方使用相对路径吗？幸运的是没有。还记得先前我们安装了`babel-preset-vue`吗？使用`webpack`的别名加上我们可以解决这个问题。

首先，使用以下命令在名为.babelrc的.storybook文件夹中创建一个文件：

```js
// /.storybook/.babelrc
{
  "presets": [
    "@babel/preset-env",
    "babel-preset-vue"
  ]
}
```

使用以下命令在`.storybook`文件夹中创建另一个名为`webpack.config.js`的文件：

```js
// /.storybook/.webpack.config.js
const path = require('path')
module.exports = {
  resolve: {
    alias: {
      '@': path.dirname(path.resolve(__dirname))
    }
  }
}
```

您现在应该能够继续使用`@alias` 来导入组件。

为了获得简洁的代码，我们现在可以更改从`import List from './List'`到`import List from '@/components/list/List`的方式。

### 模块解析失败：处理SCSS

Storybook现在抛出：

>Module parse failed: Unexpected character ‘#’ (69:13)
>您可能需要适当的加载程序来处理此文件类型。

那是因为我们还没有指定如何加载这些。我们可以通过向webpack添加`CSS/SCSS`的模块规则来解决这个问题，使我们的文件现在看起来像这样：

```js
// /.storybook/.webpack.config.js
const path = require('path')
module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../')
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.dirname(path.resolve(__dirname))
    }
  }
}
```

我们还必须将`import'@/assets/css/tailwind.css`添加到`.storybook/config.js`，以便我们可以使用Tailwind的实用程序类。

再次启动Storybook，这次你应该让浏览器打开一个最好的新选项卡：

![我们仍然需要配置Store！](https://img.90c.vip/code/img056.png?x-oss-process=image/format,webp)

## 将Vuex与Storybook结合使用

如果您在本演练之前已经遵循了[Storybook](https://storybook.js.org/docs/guides/guide-vue/)的Vue指南，那么您应该已经在`config.js`中导入和使用Vuex。

如果没有，现在应该如何看待它：

```js
// /.storybook/config.js
import Vue from 'vue'
import Vuex from 'vuex'
import { configure } from '@storybook/vue'
import '@/assets/css/tailwind.css'
Vue.use(Vuex)
function loadStories() {
  const req = require.context('../components', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}
configure(loadStories, module)
```

但这只是不会削减它。

Nuxt组件引用Store作为这个。`$store`和我们的Story不知道，因此我们需要创建一个新的Store并将其传递给我们的组件。

但我们需要重新创建整个商店吗？谢天谢地。我们确实会创建一个商店，但重用现有商店所拥有的所有现有操作，getter，突变或状态。

为此，我们将使用以下代码在`.storybook`文件夹中创建名为`store.js`的文件：

```js
// /.storybook/store.js
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// You can do the same for getters, mutations and states
import actions from '@/store/actions'
let store = new Vuex.Store({
  actions: actions
})
/**
  Bind Axios to Store as we don't have access to Nuxt's $axios instance here. See caveat below.
**/
store.$axios = axios
export default store
```

我们现在可以导入并将此store传递给我们的Stories。

目前我们只有一个故事列出用户，作为默认来源。让我们添加另一个故事来列出评论并重命名：

```js
// /components/list/List.stories.js
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import List from '@/components/list/List'
import store from '@/.storybook/store'
storiesOf('Lists', module)
  .add('Users', () => ({
    components: { List },
    store: store,
    template: '<List />'
  }))
  .add('Comments', () => ({
    components: { List },
    store: store,
    template: `<List :source="'comments'" />`
  }))
  ```

> **@nuxtjs/axios module caveat**
>`store.$axios.$axios = axios` hack允许我们将Axios传递到我们的新商店实例，但请记住它不是Nuxt的模块，因此您将无法访问其所有功能。
>为了使用需要Vuex的Stories，您可能需要对如何使用$ axios进行更改，以便您的Stories和app都能正常工作但要小心。
>在Thoro的情况下，我需要改变它的用法。$axios.$get 到 this.$axios.get。
>无法想办法访问应用程序的实际商店，所以如果您知道更好的方法，请在评论中分享！

按照上面的步骤后，我们现在应该看到列表组件的两个Stories：

![两个List故事都使用Vuex操作从API加载数据。 😌](https://img.90c.vip/code/img057.gif?x-oss-process=image/format,webp)

### 处理`<nuxt-link>`

最后我们可以看到一些东西但是我们的链接丢失了..

![图2](https://img.90c.vip/code/img058.png)

如果你在Storybook的选项卡上打开浏览器控制台，你会发现它不知道nuxt-link是什么（如果事情不能正常工作，你也可以随时查看潜在的错误）。

需要对Storybook进行最终调整才能使这些工作和功能正常。

为此，我们需要安装`@storybook/addon-actions`依赖项：`npm i -D @ storybook/addon-actions`，并通过在`.storybook`目录中使用以下行创建文件`addons.js`将它们添加到Storybook：

```js
// /.storybook/addons.js
import '@storybook/addon-actions'
import '@storybook/addon-actions/register'
```

最后，我们需要从`config.js`中的`import {action} from @storybook/addon-actions` ，并将调整后的`nuxt-link`组件注册到Vue。我们的config.js文件现在应该如下所示：

```js
// /.storybook/config.js
import Vue from 'vue'
import Vuex from 'vuex'
import { configure } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import '@/assets/css/tailwind.css'
Vue.use(Vuex)
Vue.component('nuxt-link', {
  props:   ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a href="#" @click.prevent="log()"><slot>NuxtLink</slot></a>',
})
function loadStories() {
  const req = require.context('../components', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}
configure(loadStories, module)
```

这将使用常规锚元素替换`<nuxt-link>`的所有实例，并在单击时设置显示lint路径的日志方法。

之后，我们不应再在浏览器的控制台上看到任何错误，并且在用户名上有实际的可点击链接：

![链接现在正在运行。](https://img.90c.vip/code/img059.gif?x-oss-process=image/format,webp)

## 使用Nuxt的Storybook！

花了一段时间，但我们已经设法让故事书与Nuxt.js项目中的Vue.js组件很好地配合。

这不是一个完全成熟的指南，因为我们缺少Nuxt的测试和关键方面，例如`<no-ssr>`标签（我也想知道`asyncData`和Storybook可能最终如何协同工作）。

### Bonus：将Storybook部署到Netlify

运行Storybook时，您可以获得可以与本地网络中的其他人共享的IP，如果您使用的是同一个WiFi，那就太酷了。但是，如果您想将它分享给您的客户，以便他们可以就上周的迭代给您反馈，该怎么办？

在这种情况下，将它托管在[Netlify](https://www.netlify.com/)上。只需将下面的脚本添加到package.json文件中，该文件将在storybook-static目录中生成一个静态Storybook：

```js
"build-storybook": "build-storybook -c .storybook" 
```

![通常的Netlify构建设置。](https://img.90c.vip/code/img060.png)

然后访问Netlify并选择您的存储库。将构建命令定义为`npm run build-storybook`，将发布目录定义为`storybook-static`。

然后，每次推送/合并到主分支时，都应该实时更新Storybook。[看看这个](https://pensive-lichterman-edd576.netlify.com/?path=/story/lists--users)！

### 访问环境变量

很可能您将在整个store或组件中使用环境变量。

为了使用这些变量构建Storybook，首先需要将它们[提供给Netlify](https://webpack.js.org/plugins/define-plugin/)，然后使用webpack的`DefinePlugin`通过Storybook的`webpack.config.js`公开它们，如下所示：

```js
// /.storybook/webpack.config.js
const webpack = require('webpack')
module.exports = async ({ config, mode }) => {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      YOUR_VARIABLE: JSON.stringify(process.env.YOUR_VARIABLE)
    }
  }))
  return config
}
```

## 回购和资源

随意获取Github上的代码（[https://github.com/mstrlaw/nuxt-storybook](https://github.com/mstrlaw/nuxt-storybook)并查看这些阅读材料和其他有助于构建本指南的回购：

+ Storybook’s的[Vue指南](https://storybook.js.org/docs/guides/guide-vue/);
+ [learnstorybook.com（查看指南）](https://www.learnstorybook.com/vue/en/get-started/)
+ David Walsh的[博客文章](https://davidwalsh.name/storybook-nuxt)，使用Jest潜入实际测试;
+ [这个问题](https://github.com/storybooks/storybook/issues/2934#issuecomment-373789025);

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
