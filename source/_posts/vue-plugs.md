---
title: 如何构建一个简单的Vue CLI插件
date: 2019-05-22 13:58:17
tags:
 - vue
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
# top: true
img: https://img.90c.vip/vue-cover/img004.jpg?x-oss-process=image/format,webp
# cover: true
summary: 本章节，我们将学习如何构建一个简单的Vue CLI插件。
categories: vue
---

如果您正在使用Vue框架，那么您可能已经知道Vue CLI是什么。它是快速Vue.js开发的完整系统，提供项目支架和原型设计。

CLI的一个重要部分是cli-plugins。他们可以修改内部webpack配置并将命令注入`vue-cli-service`。一个很好的例子是`@vue/cli-plugin-typescript：`当你调用它时，它会在你的项目中添加一个`tsconfig.json`并更改App.vue以获得类型，因此你不需要手动完成。

插件非常有用，今天有很多用于不同的情况 - [GraphQL + Apollo](https://github.com/Akryum/vue-apollo)支持，[Electron构建器](https://github.com/nklayman/vue-cli-plugin-electron-builder)，添加UI库，如[Vuetify](https://github.com/vuetifyjs/vue-cli-plugin-vuetify)或[ElementUI](https://github.com/ElementUI/vue-cli-plugin-element) ......但是，如果你想为某个特定的库提供一个插件并且它没有'存在吗？嗯，这是我的情况😅......我决定自己建造它。

在本文中，我们将构建一个[vue-cli-plugin-rx](https://github.com/NataliaTepluhina/vue-cli-plugin-rx)。它允许我们将`vue-rx`库添加到我们的项目中，并在我们的Vue应用程序中获得RxJS支持。

## 🎛️Vue-cli插件结构

首先，什么是CLI插件？它只是一个具有特定结构的npm包。关于[文档](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html)，它必须有一个服务插件作为其主要导出，并且可以具有其他功能，例如生成器和提示文件。

>目前尚不清楚什么是服务插件或生成器，但不用担心 - 稍后会解释！

当然，像任何npm包一样，CLI插件必须在其根文件夹中有一个`package.json`，并且拥有带有一些描述的`README.md`会很不错。

那么，让我们从以下结构开始：

```js
.
├── README.md
├── index.js      # service plugin
└── package.json
```

现在让我们来看看可选部分。生成器可以将其他依赖项或字段注入`package.json`并将文件添加到项目中。我们需要它吗？当然，我们想要添加`rxj`s和`vue-rx`作为我们的依赖项！更多的说，如果用户想在插件安装期间添加它，我们想要创建一些示例组件。因此，我们需要添加`generator.j`s或`generator/index.js`。我更喜欢第二种方式。现在结构看起来像这样：

```js
.
├── README.md
├── index.js      # service plugin
├── generator
│   └── index.js  # generator
└── package.json
```

还有一件事是添加一个提示文件：我希望我的插件询问用户是否想要一个示例组件。我们需要根文件夹中的`prompts.js`文件才能产生这种行为。所以，现在的结构看起来如下：

```js
├── README.md
├── index.js      # service plugin
├── generator
│   └── index.js  # generator
├── prompts.js    # prompts file
└── package.json
```

## ⚙️服务插件

服务插件应该导出一个接收两个参数的函数：一个PluginAPI实例和一个包含项目本地选项的对象。它可以扩展/修改不同环境的内部webpack配置，并为`vue-cli-service`注入其他命令。让我们考虑一下：我们是想以某种方式更改webpack配置还是创建一个额外的npm任务？答案是否定的，我们只想在必要时添加一些依赖项和示例组件。所以我们需要在`index.js`中更改的是：

```js
module.exports = (api, opts) => {}
```

如果您的插件需要更改webpack配置，请在官方Vue CLI文档中阅读本节。

## 🛠️通过生成器添加依赖项

如上所述，CLI插件生成器可帮助我们添加依赖项并更改项目文件。所以，我们需要的第一步是让我们的插件添加两个依赖项：`rxjs`和`vue-rx`：

```js
module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    dependencies: {
      'rxjs': '^6.3.3',
      'vue-rx': '^6.0.1',
    },
  });
}
```

生成器应该导出一个接收三个参数的函数：GeneratorAPI实例，生成器选项和 - 如果用户使用某个预设创建项目 - 整个预设将作为第三个参数传递。

`api.extendPackage`方法扩展了项目的`package.json`。嵌套字段是深度合并的，除非您将`{merge：false}`作为参数传递。在我们的例子中，我们将两个依赖项添加到`dependencies`部分。

现在我们需要更改main.js文件。为了使RxJS在Vue组件内工作，我们需要导入`VueRx`并调用`Vue.use（VueRx）`

首先，让我们创建一个我们想要添加到主文件的字符串：

```js
let rxLines = `\nimport VueRx from 'vue-rx';\n\nVue.use(VueRx);`;
```

现在我们将使用`api.onCreateComplete`钩子。将文件写入磁盘时调用它。

```js
api.onCreateComplete(() => {
    // inject to main.js
    const fs = require('fs');
    const ext = api.hasPlugin('typescript') ? 'ts' : 'js';
    const mainPath = api.resolve(`./src/main.${ext}`);
};
```

这里我们正在寻找主文件：如果它是一个TypeScript项目，它将是一个`main.ts`，否则它将是一个`main.js`文件。这里的fs是一个文件系统。

现在让我们改变文件内容

```js
api.onCreateComplete(() => {
    // inject to main.js
    const fs = require('fs');
    const ext = api.hasPlugin('typescript') ? 'ts' : 'js';
    const mainPath = api.resolve(`./src/main.${ext}`);
    // get content
    let contentMain = fs.readFileSync(mainPath, { encoding: 'utf-8' });
    const lines = contentMain.split(/\r?\n/g).reverse();
    // inject import
    const lastImportIndex = lines.findIndex(line => line.match(/^import/));
    lines[lastImportIndex] += rxLines;
    // modify app
    contentMain = lines.reverse().join('\n');
    fs.writeFileSync(mainPath, contentMain, { encoding: 'utf-8' });
  });
};
```

这里发生了什么？我们正在阅读主文件的内容，将其分成几行并恢复其顺序。然后，我们使用`import`语句搜索第一行（它将是第二次还原后的最后一行）并在那里添加我们的`rxLines`。在此之后，我们反转行数组并保存文件。

## 💻在本地测试cli-plugin

让我们在`package.json`中添加一些关于插件的信息，并尝试在本地安装它来测试。最重要的信息通常是插件名称和版本（将插件发布到npm时需要这些字段），但随时添加更多信息！可以在此处找到`package.json` 文件的完整列表。以下是我的doc：

```js
{
  "name": "vue-cli-plugin-rx",
  "version": "0.1.5",
  "description": "Vue-cli 3 plugin for adding RxJS support to project using vue-rx",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/NataliaTepluhina/vue-cli-plugin-rx.git"
  },
  "keywords": [
    "vue",
    "vue-cli",
    "rxjs",
    "vue-rx"
  ],
  "author": "Natalia Tepluhina <my@mail.com>",
  "license": "MIT",
  "homepage": "https://github.com/NataliaTepluhina/vue-cli-plugin-rx#readme"
}
```

现在是时候检查我们的插件是如何工作的！为此，让我们创建一个简单的vue-cli驱动项目：

```js
vue create test-app
```

转到项目文件夹并安装我们新创建的插件：

```js
cd test-app
npm install --save-dev file:/full/path/to/your/plugin
```

安装插件后，您需要调用它：

```js
vue invoke vue-cli-plugin-rx
```

现在，如果您尝试检查`main.js`文件，您可以看到它已更改：

```js
import Vue from 'vue'
import App from './App.vue'
import VueRx from 'vue-rx';
Vue.use(VueRx);
```

此外，您可以在测试应用程序包`package.json`的`devDependencies`部分找到您的插件。

## 📂使用生成器创建新组件

太棒了，插件有效！现在是时候扩展它的功能并使它能够创建一个示例组件。`Generator API`为此目的使用`render`方法。

首先，让我们创建这个示例组件。它应该是位于项目`src/components`文件夹中的`.vue`文件。在生成器中创建一个模板文件夹，然后模仿它内部的整个结构：

![图1](https://img.90c.vip/code/img067.png?x-oss-process=image/format,webp)

你的示例组件应该......好吧，只是一个Vue单文件组件！我不会深入研究本文中的RxJS解释，但我创建了一个简单的RxJS驱动的点击计数器，带有2个按钮：

![图2](https://img.90c.vip/code/img068.png?x-oss-process=image/format,webp)

它的源代码可以在[这里](https://github.com/NataliaTepluhina/vue-cli-plugin-rx/blob/master/generator/template/src/components/RxExample.vue)找到。

现在我们需要指示我们的插件在调用时呈现此组件。为此，我们将此代码添加到`generator/index.js`：

```js
api.render('./template', {
  ...options,
});
```

这将呈现整个模板文件夹。现在，当调用插件时，新的`RxExample.vue`将添加到`src/components`文件夹中。

>我决定不覆盖App.vue，让用户自己添加一个示例组件。但是，您可以替换现有文件的一部分，请参阅[文档](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5)中的示例

## ⌨️通过提示处理用户选择

如果用户不想拥有示例组件，该怎么办？在插件安装过程中让用户决定这一点是不是明智之举？这就是提示存在的原因！

以前我们在插件根文件夹中创建了`prompts.js`文件。该文件应包含一系列问题：每个问题都是一个具有某些字段集的对象，如名称，消息，选择，类型等。

>名称很重要：我们稍后会在生成器中使用它来创建渲染示例组件的条件！

提示可以有[不同的类型](https://github.com/SBoudrias/Inquirer.js#prompt-types)，但CLI中使用最广泛的是`复选框`和`确认`。我们将使用后者创建一个带有是/否答案的问题。

那么，让我们将我们的提示代码添加到`prompts.js`！

```js
module.exports = [
  {
    name: `addExample`,
    type: 'confirm',
    message: 'Add example component to components folder?',
    default: false,
  },
];
```

我们有一个`addExample`提示符，询问用户是否要将组件添加到`components`文件夹。默认答案是否

让我们回到生成器文件并做一些修复替换api.render

```js
if (options.addExample) {
    api.render('./template', {
      ...options,
    });
}
```

我们正在检查`addExample`是否有正答案，如果是，则将呈现该组件。

>每次更改后都不要忘记重新安装并测试插件！

## 📦公开！

重要说明：在发布插件之前，请检查其名称是否与模式`vue-cli-plugin-<YOUR-PLUGIN-NAME>`相匹配。这允许您的插件可以通过`@vue/cli-service`发现并通过`vue add`安装。

我还希望我的插件在Vue CLI UI中有一个漂亮的外观，所以我在`package.json`中添加了描述，标签和存储库名称并创建了一个徽标。徽标图片应命名为`logo.png`并放在插件根文件夹中。因此，我的插件在UI插件列表中看起来像这样：

![图3](https://img.90c.vip/code/img069.png?x-oss-process=image/format,webp)

现在我们准备发布了。你需要注册一个[npmjs.com](https://www.npmjs.com/)，显然你应该安装npm。

去发布插件，转到插件根文件夹并在终端中键入`npm publish`，你刚刚发布了一个npm包！

此时您应该能够使用`vue addcommand`安装插件。试试吧！

当然，本文中描述的插件非常基础，但我希望我的指示可以帮助某人开始使用`cli-plugins`开发。

你缺少什么样的CLI插件？请在评论中分享您的想法。