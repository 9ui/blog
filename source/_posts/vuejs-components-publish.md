---
title: 如何在NPM上发布您的Vue.js组件
date: 2019-05-21 23:23:21
tags:
  - vue
  - 组件
  - npm
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img015.jpg?x-oss-process=image/format,webp
summary: 在本系列的这一部分中，我们将重点讲如何在NPM上发布您的Vue.js组件。
categories: vue
---

![图1](https://img.90c.vip/code/img061.jpeg)

你已经用 Vue.js 创建了一个很棒的组件，你认为其他开发人员可以在他们的项目中使用它们。你怎么和他们分享？

在本文中，我将向您展示如何准备组件，以便可以在 NPM 上打包和发布它。我将使用示例项目并演示以下内容：

- 确保依赖关系不包含在包中
- 使用 Webpack 为浏览器和 Node 创建单独的构建
- 为浏览器创建插件
- package.json 的重要配置
- 在 NPM 上发布

> 注意：这篇文章最初发布[这里是 2017 年 7 月 31 日的 Vue.js 开发者博客](https://vuejsdevelopers.com/2017/07/31/vue-component-publish-npm/?utm_source=medium-vjd&utm_medium=article&utm_campaign=hpn)

## 案例研究项目：Vue Clock

我已经创建了这个简单的时钟组件，我将在 NPM 上发布。也许它不是你见过的最酷的组件，但它足以用于演示。

这是组件文件。这里没什么特别的，但请注意我正在导入时刻库以格式化时间。从包中排除依赖关系非常重要，我们将在稍后介绍。

```js
<template>
  <div></div>
</template>
<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        time: Date.now()
      }
    },
    computed: {
      display() {
        return moment(this.time).format("HH:mm:ss");
      }
    },
    created() {
      setInterval(() => {
        this.time = Date.now();
      }, 1000);
    }
  }
</script>
```

## 关键工具：Webpack

我为 NPM 准备这个组件所需要做的大部分工作都是通过 Webpack 完成的。这是我将在本文中添加的基本 Webpack 设置。如果您之前使用过 Vue 和 Webpack，它不应该包含很多惊喜：

```js
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname + "/src/Clock.vue"),
  output: {
    path: path.resolve(__dirname + "/dist/"),
    filename: "vue-clock.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue"
      },
      {
        test: /\.css$/,
        loader: "style!less!css"
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      mangle: true,
      compress: {
        warnings: false
      }
    })
  ]
};
```

## 外部配置

外部配置选项提供了一种从 Webpack 输出包中排除依赖项的方法。我不希望我的包包含依赖项，因为它们会膨胀其大小并可能导致用户环境中的版本冲突。用户必须自己安装依赖项。

在案例研究项目中，我使用时刻库 ​​ 作为依赖。为了确保它不会捆绑到我的包中，我将在 Webpack 配置中将其指定为外部：

```js
module.exports = {
  ...
  externals: {
    moment: 'moment'
  },
  ...
}
```

## 环境搭建

```js
<script type="text/javascript" src="vue-clock.js" />
```

其次，基于 Node.js 的开发环境，例如

```js
import VueClock from "vue-clock";
```

理想情况下，我希望用户能够在任一环境中使用 Vue Clock。不幸的是，这些环境要求代码以不同方式捆绑，这意味着我将不得不设置两个不同的构建。

为此，我将创建两个单独的 Webpack 配置。这比听起来容易，因为配置几乎相同。首先，我将创建一个公共配置对象，然后使用 webpack-merge 将其包含在两个环境配置中：

```js
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

var commonConfig = {
  output: {
    path: path.resolve(__dirname + '/dist/'),
  },
  module: {
    loaders: [ ... ]
  },
  externals: { ... },
  plugins: [ ... ]
};

module.exports = [

  // Config 1: For browser environment
  merge(commonConfig, {

  }),

  // Config 2: For Node-based development environments
  merge(commonConfig, {

  })
];
```

常见配置与之前完全相同（我已经将其大部分缩写为节省空间），除了我已经删除了`entry`和`output.filename`选项。我将在单独的构建配置中单独指定它们。

## 浏览器捆绑

浏览器无法以与Node相同的方式从其他文件导入JavaScript模块。他们可以使用类似AMD的脚本加载器，但为了最大限度地轻松，我希望允许将组件脚本更简单地添加为全局变量。

此外，我不希望用户必须考虑太难以弄清楚如何使用该组件。我会这样做，这样当用户包含脚本时，组件可以很容易地注册为全局组件。Vue的插件系统将在这里提供帮助。

我的目标是这个简单的设置：

```js
<body>
<div id="app">
  <vue-clock></vue-clock>
</div>
<script type="text/javascript" src="vue-clock.js"></script>
<script type="text/javascript">
  Vue.use(VueClock);
</script>
</body>
```

### 插件

首先，我将创建一个插件包装器，以便于组件的轻松安装：

```js
import Clock from './Clock.vue';

module.exports = {
  install: function (Vue, options) {
    Vue.component('vue-clock', Clock);
  }
};
```

该插件全局注册组件，因此用户可以在其应用程序的任何位置调用时钟组件。

### Webpack配置

我现在将使用插件文件作为浏览器构建的入口点。我将输出到一个名为`vue-clock.min.js`的文件，因为这对用户来说是最明显的。

```js
module.exports = [
  merge(config, {
    entry: path.resolve(__dirname + '/src/plugin.js'),
    output: {
      filename: 'vue-clock.min.js',
    }
  }),
  ...
];
```

### 导出为库

Webpack可以以各种不同的方式公开您的捆绑脚本，例如作为`AMD`或`CommonJS`模块，作为对象，作为全局变量等。您可以使用`libraryTarget`选项指定它。

我还将库名称指定为'VueClock'。这意味着当浏览器包含该捆绑包时，它将作为全局`window.VueClock`。

```js
output: {
  filename: 'vue-clock.min.js',
  libraryTarget: 'window',
  library: 'VueClock'
}
```

## Node打包

为了允许用户在基于`Node-based`的开发环境中使用该组件，我将使用Node bundle的UMD库目标。UMD是一种灵活的模块类型，允许代码在各种不同的脚本加载器和环境中使用。

```js

module.exports = [
  ...
  merge(config, {
    entry: path.resolve(__dirname + '/src/Clock.vue'),
    output: {
      filename: 'vue-clock.js',
      libraryTarget: 'umd',

      // These options are useful if the user wants to load the module with AMD
      library: 'vue-clock',
      umdNamedDefine: true
    }
  })
];
```

请注意，Node捆绑包使用单文件组件作为其入口点，并且不使用插件包装器，因为它不是必需的。这允许更灵活的安装：

```js
import VueClock from 'vue-clock';

new Vue({
  components: {
    VueClock
  }
});
```

## package.json

在发布到NPM之前，我将设置我的`package.json`文件。有关每个选项的详细说明，请访问[npmjs.com](https://www.npmjs.com/)。

```js
{
  "name": "vue-clock-simple",
  "version": "1.0.0",
  "description": "A Vue.js component that displays a clock.",
  "main": "dist/vue-clock.js",
  "scripts": {
    "build": "rimraf ./dist && webpack --config ./webpack.config.js"
  },
  "author": "Anthony Gore",
  "license": "MIT",
  "dependencies": {
    "moment": "^2.18.1"
  },
  "repository": { ... },
  "devDependencies": { ... }
}
```

我已经缩写了这个文件的大部分内容，但需要注意的重要事项是：

1. **主要的script file i.e.** `"main": "dist/vue-clock.js"`。这指向Node包文件，确保模块加载器知道要读取哪个文件，即

```js
import VueClock from 'vue-clock' // this resolves to dist/vue-clock.js
```

2. **依赖:**由于我从包中排除了任何依赖项，因此用户必须安装依赖项才能使用该包。

## 发布到NPM

现在我的组件设置正确，它已准备好在NPM上发布。我不会在这里重复说明，因为它们在[npmjs.com](https://www.npmjs.com/)上得到很好的报道。

这是结果：

![图2](https://img.90c.vip/code/img062.png?x-oss-process=image/format,webp)

+ [Github code](https://github.com/anthonygore/vue-clock-simple)
+ [NPM page](https://www.npmjs.com/package/vue-clock-simple)

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
