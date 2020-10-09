---
title: 使用GitLab的CI / CD管道将Vue.js应用程序部署到Netlify
date: 2019-05-20 10:48:09
tags:
  - vue
  - 集成
author: 左智文
img: https://img.90c.vip/vue-cover/img017.jpg?x-oss-process=image/format,webp
summary: 本章节，我们将关注如何使用GitLab的CI / CD管道将Vue.js应用程序部署到Netlify。
categories: vue
---

设置从A到Z的持续集成管道：运行测试，构建应用程序并将其部署到Netlify。我们开始做吧！🤓

![图1](https://img.90c.vip/code/img044.png?x-oss-process=image/format,webp)

到目前为止，您可能已经使用他们的UI将项目部署到[Netlify](https://www.netlify.com/)，方法是链接GitHub/GitLab项目并设置构建应用程序的必要步骤。

您可能不知道的是Netlify有一个基于节点的[CLI工具](https://cli.netlify.com/)，可以让您从终端进行部署。

此外，GitLab的CI/CD管道免费提供CI管道2,000分钟/月，我们可以使用它来自动化我们的测试和部署过程。

## 本章内容

**1. 创建一个新项目;**
**2. 将它推到GitLab;**
**3. 将它推到GitLab;**
**4. 安装netlify-cli;**
**5. 准备GitLab CI/CD**
**6. 定义CI / CD管道**
**7. 结果：它混合了吗？**
**8. 添加暂存预览;**
**9. 下一步;**
**10. 回购与资源;**

## 创建一个新项目

我们可以使用命令`vue create vue_netlify_ci`创建一个名为`vue_netlify_ci`的新项目

这是我使用的配置：

![Babel + Router + Vuex + Sass/SCSS Pre-processors(node-sass) + Standard Linter + Jest Unit-testing](https://img.90c.vip/code/img045.png?x-oss-process=image/format,webp)

## 将其推送到GitLab仓库

标准程序。

## 全局安装netlify-cli

运行`npm i netlify-cli -g`并通过键入`netlify -v`确保它已正确安装。控制台会打印出`netlify-cli/2.11.10 darwin-x64 node-v10.15.3`的信息。

>没有找到指令？
>当您尝试运行netlify时，您可能会收到“未找到命令”消息。这很可能是由于某些问题与您首先安装Node + npm有关。要解决这个问题，你需要更新$ PATH env（对于MacOS / Linux，这个过程应该大致相同。）
>查看安装netlify-cli的结果，它应该类似于：

```js
/usr/local/Cellar/node/8.7.0/bin/ntl -> /usr/local/Cellar/node/8.7.0/lib/node_modules/netlify-cli/bin/run
/usr/local/Cellar/node/8.7.0/bin/netlify -> /usr/local/Cellar/node/8.7.0/lib/node_modules/netlify-cli/bin/run
+ netlify-cli@2.11.10
updated 1 package in 5.123s
```

>在我的例子中，netlify可以在`/usr/local/Cellar/node/8.7.0/bin/`中找到这就是我们需要添加到`.bash_profile`的行。为此，使用`vim~ / .bash_profile`进入它并添加行`export PATH =/usr/local/Cellar/ node/8.7.0/bin/：$PATH`（注意你需要根据你的输出改变它）。
>保存并运行source~ / .bash_profile，现在可以在终端中访问netlify。

## 准备Netlify for CI

### 将您的仓库链接到新的Netlify项目

运行`netlify init --manual`并按照以下向导步骤操作：

1. 选择：创建和配置新站点
2. 给它一个名字（可选）（我们称之为`vue-netlify-ci`）
3. 选择您的团队（如果有）并按Enter键完成。

>注意：如果您是第一次使用netlify CLI，系统会提示您授权连接到您的帐户（它将使用授权UI打开浏览器窗口）。

在这些之后，你将在Netlify中创建你的项目，但它不会被部署（因为我们还没有告诉它如何这样做）。

![一切都好。在继续之前，我们实际上需要一个站点ID。](https://img.90c.vip/code/img045.png?x-oss-process=image/format,webp)

我们现在有一个站点ID，我们需要`GitLab YAML`指令。

### 生成个人访问令牌

如果您已登录Netlify，请单击此处直接转到右侧部分。作为参考，它位于用户设置>应用程序下。

为令牌添加描述，例如CI，并将其保存在安全的地方！使用生成的令牌退出该页面后，您将无法再检索它。如果你丢失它，你需要生成一个新的。

### 设置Netlify的配置文件

我们可以描述Netlify如何使用TOML标记语言构建和部署您的网站。在我们的例子中，只需在项目的根目录下创建一个名为netlify.toml的文件，其中包含以下内容：

这里发生了什么事？我们只是告诉Netlify哪个目录包含构建生成的部署就绪资产。

>（注意：在我们的例子中，我们使用GitLab的运行程序构建应用程序并将所有捆绑包一起部署，而您通常使用`command =“npm run build`告诉Netlify首先构建应用程序）。

我们现在有一个访问令牌，站点的ID，我们告诉Netlify如何处理部署过程。在GitLab上。

## 准备GitLab CI / CD

GitLab的CI/CD非常简单。如果您推送到repo并且它在项目中检测到`.gitlab-ci.yml`文件，它将使用[共享运行](https://docs.gitlab.com/ee/user/gitlab_com/#shared-runners)程序根据提供的说明运行其中的脚本。

![访问CI/CD配置](https://img.90c.vip/code/img047.png)

在设置文件之前，我们需要设置环境变量，以便我们的.yml不会暴露任何敏感数据，即访问令牌和站点ID。

为此，请导航到“设置”>“CI / CD”并展开“变量”部分。

添加`NETLIFY_AUTH_TOKEN`和`NETLIFY_SITE_ID`，每个都有各自的值。
>（提示：如果您不记得您的边ID，您可以在`.netlify/state.json`下的项目根目录中看到它）。

![访问CI/CD配置](https://img.90c.vip/code/img048.png?x-oss-process=image/format,webp)

保存它们，我们现在准备好最后准备添加`.gitlab-ci.yml`

## 定义CI/CD管道

GitLab CI/CD管道使用每个项目中名为`.gitlab-ci.yml`的YAML文件进行配置。

在项目的根目录中，创建一个名为`.gitlab-ci.yml`的文件并添加以下内容：

```js
image: node:10.15.3

cache:
  untracked: true
  paths:
    - node_modules/

stages:
  - setup
  - test
  - build
  - deploy

setup:
  stage: setup
  script:
    - npm ci
  only:
    - master

test:
  stage: test
  script:
    - npm run test:unit
  only:
    - master

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist
  only:
    - master

deploy:
  stage: deploy
  script:
    - npm i -g netlify-cli
    - netlify deploy --site $NETLIFY_SITE_ID --auth $NETLIFY_AUTH_TOKEN --prod
  dependencies:
    - build
  only:
    - master
```

这将建立一个4阶段的管道，
1）设置项目的依赖关系;
2）进行我们的测试;
3）构建应用程序;
4）将其部署到Netlify。

有关正在使用的内容的一些细节：

[**image:**](https://docs.gitlab.com/ee/ci/yaml/#image) 指示要用于作业的Docker。

[**cache:**](https://docs.gitlab.com/ee/ci/caching/)允许我们通过保持依赖关系来加速对给定作业的后续运行的调用，在本例中为node_modules。更多关于缓存的信息。

[**artifacts:**](https://docs.gitlab.com/ee/ci/yaml/README.html#artifacts)指定我们想要为以下作业提供的文件/目录。

[**dependencies:**]与工件一起使用。允许我们将构建阶段（dist文件夹）的结果用于部署阶段。

[**npm ci:**](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable) “npm ci绕过一个软件包的package.json，从软件包的lockfile [..]中安装模块，为持续集成/持续部署过程的构建性能和可靠性提供了重大改进”。

[**netlify deploy:**](https://cli.netlify.com/commands/deploy/)将我们的站点部署到Netlify，具体为：--site $ NETLIFY_SITE_ID和--auth $ NETLIFY_AUTH_TOKEN表示我们要部署的站点并对我们进行身份验证以进行部署（使用我们之前设置的CI / CD env变量）。--prod表示我们要部署到生产环境。

## 结果：它混合了吗？

最后，添加并提交文件和`git push`（我们一直在处理master分支。理想情况下，你会推送到一个单独的分支，然后`PR + Merge into master`。只有对master的更改才会影响CI管道）。

一旦你推/合并到master，GitLab就会触发它的runners并执行管道。

![通过, 通过, 通过 和 通过 😎](https://img.90c.vip/code/img049.gif?x-oss-process=image/format,webp)

在GitLab项目中，导航到CI/CD>管道或CI/CD>作业以详细查看每个阶段的状态。如果出现错误，请务必单击该作业并查看日志以了解问题所在。

![您可以在CI / CD>作业中查看管道的各个作业](https://img.90c.vip/code/img049.png?x-oss-process=image/format,webp)

## 添加暂存预览

你知道什么会酷吗？能够在单独的部署上预览新功能。NetLify可以选择在链接您的仓库时为每个PR / MR部署预览，就像通常使用UI一样。

对我们来说不幸的是，似乎[现在不可能](https://github.com/netlify/cli/issues/275)仅使用我们的CI管道和/或Netlify的CLI来自动部署，因此我们将采用不同的方式。

最后，我们将看到如下所示的流程：

![在发送到生产之前，我们可以预览测试分支和分段。](https://img.90c.vip/code/img049.gif?x-oss-process=image/format,webp)

### 在Netlify中创建一个项目

在Netlify中创建一个新项目，该项目将托管登台以及合并请求的预览。我们将它命名为生产的名称，因此看起来像`staging-vue-netlify-ci.netlify.com`。这只是为了帮助区分两个项目，您可以使用任何您想要的命名。

### 将暂存项目链接到仓库

![图1](https://img.90c.vip/code/img052.png?x-oss-process=image/format,webp)

选择项目后，选择将负责表示我们的暂存预览的开发分支。

将构建命令定义为npm run build并将发布目录设置为dist。

一旦你保存它，Netlify将观察开发分支并自动构建MR预览和生产构建（在这种情况下，生产被视为我们的阶段。真正的生产是由我们自己的管道记住吗？）。

### 创建合并请求到开发

记住上面的流程，您可以生成所需的部署：

+ 每个分支有一个合并请求开发（理想的快速测试功能，假设，快速展示）;
+ 一个用于发展部门，作为我们的集结环境;

当合并到master中时，我们可以继续使用我们自己的CI管道进行应用测试。当然，您可以更改整个流程以满足您的需求。

![Netlify的部署被视为外部阶段。一旦合并到master中，就会使用我们自己的管道。](https://img.90c.vip/code/img053.gif?x-oss-process=image/format,webp)

通过这种方式设置它的另一个好处是，我们的MR预览和开发部署的构建都由Netlify处理，这意味着我们不会浪费GitLab提供的CI分钟。👌

## 下一步

正如您所看到的，使用GitLab设置连续集成和交付管道以在Netlify上托管Vue.js应用程序非常容易。

### 优化管道时间

请记住，随着应用程序获得新功能，并且当您添加更多测试时，CI / CD管道的各个阶段将需要更长时间才能完成。重要的是要保持它的快速，不仅是为了敏捷流程而且是出于成本原因，因为GitLab每月仅为CI / CD提供2k的免费分钟⏱️。

到目前为止，我还没有使用.gitlab-ci.yml的配置，我确​​信上面的时间可以大大减少。[Wes Cossick](https://blog.sparksuite.com/7-ways-to-speed-up-gitlab-ci-cd-times-29f60aab69f9)的这篇文章详细介绍了加快管道执行时间的一些方法。我将通过基准测试和改进来审阅本文，因为我改进了项目的管道。

## 回购和资源

这些提供的配置文件应该足够了，但是如果你想查看一下存储库（具有Netlify的部署状态标记），你可以在这里获取它（[https://gitlab.com/mstrlaw/vue_netlify_ci](https://gitlab.com/mstrlaw/vue_netlify_ci)）。

资源/阅读材料：

+ [Vue.js部署通用指南](https://cli.vuejs.org/guide/deployment.html#general-guidelines)

+ [创建和使用GitLab管道](https://docs.gitlab.com/ee/ci/pipelines.html)

+ [netlify.toml参考](https://www.netlify.com/docs/netlify-toml-reference/)

+ [.gitlab-ci.yml参考](https://docs.gitlab.com/ee/ci/yaml/)

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
