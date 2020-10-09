---
title: 构建您的Sass项目
date: 2019-05-19 15:48:47
tags:
 - sass
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/sass-cover/sass025.jpg?x-oss-process=image/format,webp
summary: 本章节，我们将学习如何使用sass来构建我们的Sass项目。
categories: 前端
---

![media-sass](https://img.90c.vip/code/img043.png?x-oss-process=image/format,webp)

让我们来看看我们如何构建我们的Sass项目。随着项目的增长和扩展，模块化我们的目录和文件结构的需求急剧增加。因此，保持我们的文件和文件夹组织是至关重我们还有一个额外的好处，就是创建可以在多个项目中重用的组件。

本文接下来是从Sass开始，我们了解了使Sass成为如此强大工具的功能，以及如何设置本地Sass开发环境。

>我们如何构建我们的Sass项目？

我们通过使用Partials将样式表分成单独的文件来完成此操作。单独的文件将代表不同的组件。然后，我们使用`@import`指令将我们的部分导入一个主样式表 - 通常是`main.scss`文件。例如：

```ccs
// File: main.scss
@import 'layout/header';
```

然后，我们可以为布局特定文件创建布局文件夹，例如：

```css
// File: _header.scss
// This file contains all styles related to the header of the site/application.
/* STYLES GO HERE */
```

> 注意：部分文件的名称始终以下划线_开头。

让我们来看看如何构建项目。

## 结构简单

如果你在一个小项目上使用Sass，例如 - 一个网页。一个非常小的结构可能如下：

```css
_base.scss
_layout.scss
_components.scss
main.scss
```

这里我们有3个部分连接到我们的`main.scss`。

**Base：**包含在此文件中的是您的所有重置，变量，mixin和任何实用程序类。

**Layout：**包含处理布局的所有CSS，例如容器和任何网格系统。

**Components：**任何可重复使用的东西，如按钮，导航栏，卡片等。

**Main：**它应该只包含上述文件的导入。

如果任何文件变得过于混乱或混乱，那么是时候扩展我们的结构了。例如，考虑为组件添加一个文件夹，并将其分解为单个文件，例如`_button.scss`和`_carousel.scss`。

但是，当我们正在开展一个更大的项目时，我们需要一个更严格的架构，我们将在下一节中介绍。

## 7-1模式

被称为7-1模式（7个文件夹，1个文件）的体系结构是一种广泛采用的结构，可作为大型项目的基础。您将所有部分组织到7个不同的文件夹中，并且单个文件位于根级别（通常名为`main.scss`）以处理导入 - 这是您编译到CSS中的文件。

这是一个示例7-1目录结构，我已经包含了一些文件的例子，这些文件将放在每个文件夹中：

```css
sass/
|
|– abstracts/ (or utilities/)
|   |– _variables.scss    // Sass Variables
|   |– _functions.scss    // Sass Functions
|   |– _mixins.scss       // Sass Mixins
|
|– base/
|   |– _reset.scss        // Reset/normalize
|   |– _typography.scss   // Typography rules
|
|– components/ (or modules/)
|   |– _buttons.scss      // Buttons
|   |– _carousel.scss     // Carousel
|   |– _slider.scss       // Slider
|
|– layout/
|   |– _navigation.scss   // Navigation
|   |– _grid.scss         // Grid system
|   |– _header.scss       // Header
|   |– _footer.scss       // Footer
|   |– _sidebar.scss      // Sidebar
|   |– _forms.scss        // Forms
|
|– pages/
|   |– _home.scss         // Home specific styles
|   |– _about.scss        // About specific styles
|   |– _contact.scss      // Contact specific styles
|
|– themes/
|   |– _theme.scss        // Default theme
|   |– _admin.scss        // Admin theme
|
|– vendors/
|   |– _bootstrap.scss    // Bootstrap
|   |– _jquery-ui.scss    // jQuery UI
|
`– main.scss              // Main Sass file
```

**Abstracts (or utilities):**拥有Sass工具，帮助文件，变量，函数，mixins和其他配置文件。这些文件只是帮助程序，在编译时不输出任何CSS。

**Base:** 保存项目的样板代码。包括标准样式，如重置和排版规则，这些都是整个项目中常用的。

**Components (or modules):**包含按钮，轮播图，滑块和类似页面组件的所有样式（想想小部件）。您的项目通常包含许多组件文件 - 因为整个站点/应用程序应该主要由小模块组成。

**Layout:**包含项目布局涉及的所有样式。如页眉，页脚，导航和网格系统的样式。

**Pages:**任何特定于各个页面的样式都将位于此处。例如，您网站的主页要求页面特定样式。

**Themes:**这很可能在许多项目中都没有使用。它将保存创建项目特定主题的文件。例如，如果您网站的各个部分包含备用配色方案。

**Vendors:**从外部库和框架中获取所有第三方代码 - 例如`Normalize`，`Bootstrap`，`jQueryUI`等。但是，通常需要覆盖供应商代码。如果需要，最好创建一个名为`vendors-extensions` /的新文件夹，然后在他们覆盖的供应商之后命名任何文件。`filevendors-extensions` / `_bootstrap.scss`将包含所有Bootstrap覆盖 - 因为编辑供应商文件本身通常不是一个好主意。

**Main.scss:**此文件应仅包含您的导入！例如..

```css
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';

@import 'vendors/bootstrap';
@import 'vendors/jquery-ui';

@import 'base/reset';
@import 'base/typography';

@import 'layout/navigation';
@import 'layout/grid';
@import 'layout/header';
@import 'layout/footer';
@import 'layout/sidebar';
@import 'layout/forms';

@import 'components/buttons';
@import 'components/carousel';
@import 'components/slider';

@import 'pages/home';
@import 'pages/about';
@import 'pages/contact';

@import 'themes/theme';
@import 'themes/admin';
```

>注意：导入时无需包含_或.scss文件扩展名。

- 启动并运行7-1:

官方样板在github上。您可以使用以下终端命令下载或克隆它：

git clone [https://github.com/HugoGiraudel/sass-boilerplate.git](https://github.com/HugoGiraudel/sass-boilerplate)

## 结论

就是这样！您已经学会了如何构建Sass项目。要记住的是，这里没有明确的规则。您应该以对您（以及您的团队！）有意义的方式构建项目。帮助您快速轻松地找到并隔离您的样式的方式 - 是要走的路！

<!-- 请务必查看本系列的下一篇文章：设置Sass构建过程。我们将使用npm脚本来设置项目构建过程，这将显着提升我们的开发工作流程。 -->

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
