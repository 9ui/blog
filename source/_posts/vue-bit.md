---
title: 使用Bit.dev在云中共享和重用Vue Mixins
date: 2019-05-22 10:20:49
tags:
  - vue
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/vue-cover/img002.jpg?x-oss-process=image/format,webp
# top: true
# cover: true
summary: 本章节，我们将学习如何使用Bit.dev在云中共享和重用Vue Mixins。
categories: vue
---

![Bit.dev](https://img.90c.vip/code/img063.png?x-oss-process=image/format,webp)

## 在你开始之前

这篇文章适合所有使用Vue JS的开发人员，包括初学者。它还介绍了令人惊叹的Vue组件共享工具[Bit](https://bit.dev/)。在阅读本文之前，您应该具备一些先决条件。

您将需要以下内容：

+ Node.js版本10.x及更高版本已安装。您可以通过在终端/命令提示符中运行以下命令来验证是否这样做：

```js
 node -v
```

+ 还安装了Node Package Manage 6.7或更高版本（NPM）。
+ 代码编辑器：强烈建议使用Visual Studio Code。[这就是原因](https://blog.bitsrc.io/a-convincing-case-for-visual-studio-code-c5bcc18e1693)
+ Bit的最新版本，全局安装在您的机器上。

```js
npm install bit-bin -g
```

+ Vue的最新版本，全局安装在您的机器上。
+ 您的计算机上安装了Vue CLI 3.0。为此，请先卸载旧的CLI版本：

```js
npm uninstall -g vue-cli
```

然后安装新的：

```js
npm install -g @vue/cli
```

+ 在这里下载Vue Mixins启动项目 [viclotana/Mixins_starter](https://github.com/viclotana/Mixins_starter)
+ 解压缩下载的项目
+ 导航到解压缩的文件并运行命令以使所有依赖项保持最新：

```js
npm install
```

## 什么是Vue Mixins

Vue中的Mixins基本上是一组定义的逻辑，由Vue以特定的规定方式存储，可以反复使用，以便为Vue实例和组件添加功能。因此，Vue mixins可以在多个Vue组件之间共享，而无需在项目中重复代码块。使用称为SASS的CSS预处理器的人对mixins有很好的了解。

## 演示

如果你从一开始就关注这篇文章，你必须从上面提供的GitHub链接获得Mixins入门应用程序。在组件文件夹中，您将看到两个组件：

上面的组件显示一个按钮，单击该按钮时显示警报模式。下面的第二个组件完全相同：

因此，使用Vue Mixins，您可以简单地存储一个您知道将作为mixin重复使用的逻辑，然后将其导入到您希望使用它的任何组件中。但是，该组件必须位于同一个项目中。

## Vue Mixins创建的4个阶段

创建Vue mixin时需要执行以下四个步骤：

### 创建一个Mixin 文件

Mixin文件只是您可以导出的javascript文件，其中包含您要重用的逻辑或功能。在src文件夹中创建一个名为Mixins的新文件夹，并在其中创建一个名为`clickMixin.js`的文件。将下面的代码粘贴到其中。

这是我们必须使用两次的确切功能，现在我们已经将它作为mixin，它现在可以重复使用。

### 导入Mixin文件

下一步是将mixin文件导入到所需的确切组件中。在我们的例子中，它位于我们要导入它的两个组件中。使用以下命令在两个组件中导入clickMixin：

```js
import clickMixin from ‘../Mixins/clickMixin’
```

### 删除重复的逻辑

```js
// remove this code block and the comma before it.
methods: {
clicked(value){
alert(value);
}
}
```

### 注册Mixin

最后一步是告诉Vue你有一个mixin准备好通过注册来使用。默认情况下，Vue中的Mixins注册为数组，如下所示：

将此mixins选项添加到两个组件后，继续运行您的应用程序。

```js
npm run serve
```

![图2](https://img.90c.vip/code/img064.gif?x-oss-process=image/format,webp)

可能会发现关于理解Vue JS中的mixins的完整文章真的很有帮助。

## Vue Mixins的局限性

Mixins解决了我们在编写代码时经常遇到的非常大的重用问题。我们有一个平台，我们可以在其中保留逻辑，以便我们可以重复使用它，我们不再需要重复自己。这个平台也很容易使用，但是当我们想要扩展mixin的范围时会发生什么。如果我们希望能够跨多个项目共享mixin，想象一下如果可以在多个项目之间共享，那么像mixin这样的抽象逻辑有多强大。不幸的是，我们不能用Vue mixins做到这一点。

## 介绍Bit.dev

[Bit](https://bit.dev/)是一个非常强大且易于使用的工具，旨在帮助团队轻松地在项目内和项目间共享和管理代码组件。我们已经知道当我们了解Mixins时，代码重用的有效性如何。Bit就像是云中的高级混合技术 - 想想GitHub的组件（或者更好的是，`'GitHub + NPM'`用于组件）

最近，越来越多的开发团队正在分发，因此，更多的技术支持全球协作。Bit是一种革命性的工具，可以很好地定位为云中的代码组件共享工具。它可以帮助团队将共享组件扩展到数百甚至数千个组件，同时消除此过程的开销。让我们使用Bit在多个项目中共享我们已经创建的`clickMixin`。

## 入门

转到[Bit官方网页](https://bit.dev/)创建一个帐户，它是免费的。

在您的机器上全局安装Bit：

```js
npm install bit-bin -g
```

## 初始化Bit

选择包含您要共享和重用的组件的现有存储库，以及在项目目录中[初始化Bit工作空间](https://docs.bit.dev/docs/initializing-bit.html)。在我们的例子中，它是您机器中的Vue mixin文件夹。在VS Code中打开一个终端并输入以下命令：

```js
bit init
```

它会询问您是否要匿名发送分析反馈给Bit以便他们继续改进项目，您可以选择是或否。然后，您应该在提示符上看到成功消息

```js
successfully initialized a bit workspace.
```

Bit命令非常简单，与Git命令类似，因此您不必阅读任何新文档。

## 跟踪组件

下一步是使用Bit跟踪您选择的组件，这些组件可以是您的整个组件文件夹或任何特定组件。在我们的例子中，我们想要跟踪所有mixin所在的mixins文件夹。我们使用bit add命令执行此操作，如下所示：

```js
bit add src/Mixins/*
```

这与Git add类似，用于跟踪更改。它应该显示它正在跟踪的mixin的名称，如下所示：

```js
tracking component click-mixin:
```

## 标记组件版本

要为组件设置版本，请使用bit tag命令。Bit锁定每个组件的依赖关系图的状态，使其版本不可变。标记组件时，Bit首先运行组件的构建和测试任务。您可以使用--all标记来标记工作空间中的所有组件。

```js
bit tag --all 1.0.0
```

标记后，您应该看到如下的成功消息：

```js
1 component(s) tagged | 1 added, 0 changed, 0 auto-tagged
added components: click-mixin@1.0.0
```

## 导出组件

现在我们的组件被跟踪和版本化，将它们导出（发布）到远程集合。转到Bit官方主页并创建一个集合。集合就像一个托管和组织组件的repo桶。使用`bit export`命令将组件从工作区发布到bit.dev：

```js
bit export user-name.collection-name
```

它将询问您的位用户名和密码，并在身份验证后将其推送到云端。你现在可以直接去查看你的远程集合中的mixin，这是公共的（如果这是你设置它的方式），就像公共GitHub repos一样。

![Bit repository](https://img.90c.vip/code/img065.png?x-oss-process=image/format,webp)

## 在其他项目中使用Mixins

要在任何其他项目中使用您在云中共享的mixin：

+ 在所需项目中安装mixin。
+ 将mixin导入要使用它的特定组件中。

mixin可以像它是代码库的一部分一样使用。

让我们构建一个新项目并将此单击mixin添加到其中。创建一个新的Vue项目或[下载此Vue Mixins启动项目](https://github.com/viclotana/Mixins_starter)。

您需要做的就是使用您喜欢的包管理器，NPM或Yarn在项目内的云中安装mixins。在你的mixin集合（“repo”）里面，Bit已经完成了打包和提供安装命令的所有脏工作。

```js
npm install @bit/viclotana.vue_collection.click-mixin
```

![图3](https://img.90c.vip/code/img066.png?x-oss-process=image/format,webp)

现在您已经在新项目中安装了mixin，您可以直接从mixin所在的节点模块导入mixin。在这个阶段，进入两个组件并将其复制到其中：

```js
<template>
<div>
<button v-on:click=”clicked(‘you just clicked on button 2’)”>Button 2</button>
</div>
</template>
<script>
import clickMixin from ‘@bit/viclotana.vue_collection.click-mixin’
export default {
name: ‘Modal’,
mixins: [clickMixin]
}
</script>
```

在开发服务器中运行应用程序时，您将看到它的运行方式与项目中的mixins完全相同。

## 结论

您已经了解Bit作为一个功能强大的组件共享工具。您还了解了在处理多个项目或与团队合作时如何使用它来扩展工作流中Vue mixins的功能。请随时在下面的评论中写信给我
