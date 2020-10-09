---
title: Sass mixins编写媒体查询
date: 2019-05-19 15:33:36
tags:
  - sass
author: 左智文
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
img: https://img.90c.vip/sass-cover/sass025.jpg?x-oss-process=image/format,webp
summary: 本章节，我们将使用sass实现响应式设计，使用媒体查询media。
categories: 前端
---

![media-sass](https://img.90c.vip/code/img043.png?x-oss-process=image/format,webp)

响应式设计在今天的网络中至关重要。越来越多的设备用于访问我们的网站和应用程序。我们需要确保在使用我们的产品时满足所有用户的需求。媒体查询是我们可以用来帮助确保我们的布局适应不同设备的技术之一。

## 媒体查询

媒体查询是 CSS3 模块，它允许内容呈现并适应屏幕分辨率等条件。例如：

```css
@media (max-width: 599px) {
  font-size: 1rem;
}
```

在视口大小<= 599px 时，我们将字体大小设置为 1rem。

很简单，当然我们需要多个媒体查询才能拥有一个完全响应的网站。但是，我们不可避免地需要编辑实际断点的规则。并且搜索所有代码以更改由规则更改影响的每一行都远非理想。一定有更好的方法！

现代布局规范在过去几年中有了很大改进，Grid 和 Flexbox 默认是响应式的。这有助于我们减少项目中所需的媒体查询量，并使代码更清晰。但是，媒体查询仍然在现代 Web 开发中占有一席之地。随着我们的项目变得越来越大，我们需要一种方法来管理它们。输入 Sass mixins！

## Mixins

Sass mixins 使我们能够创建可重复使用的代码块 - 它们可以减少重复次数，促进干代码并且易于维护。将媒体查询编写为 mixin 以注入样式表，无论它们在何处需要 - 都非常有意义！让我们来看看一个例子..

- 设置你的 mixins

```css
@mixin for-phone-only {
  @media (max-width: 599px) {
    @content;
  }
}
@mixin for-tablet-portrait-up {
  @media (min-width: 600px) {
    @content;
  }
}
@mixin for-tablet-landscape-up {
  @media (min-width: 900px) {
    @content;
  }
}
@mixin for-desktop-up {
  @media (min-width: 1200px) {
    @content;
  }
}
@mixin for-big-desktop-up {
  @media (min-width: 1800px) {
    @content;
  }
}
```

在这里，我们将 5 个常见断点写入@mixin 块。注意@content 是 Sass 的一个指令，它允许稍后插入内容。如果您不确定将此代码放在文件夹结构中的位置，请参阅构建 Sass 项目。

- 使用 mixin

假设我们想使用 mixin 来减少移动设备上标题文本的字体大小。我们将 mixin 添加为 include，如下所示：

```css
.header-title {
  font-size: 2rem;

  @include for-phone-only {
    font-size: 1rem;
  }
}
```

当我们编译您的项目时，我们的@include 将转换为：

```css
@media (max-width: 599px) {
  font-size: 1rem;
}
```

我们现在能够在整个项目中随时随地插入媒体查询。我们不需要记住断点，因为我们已经预先定义了断点。如果我们需要改变它们，我们可以简单地编辑 mixins。

- 另一种设置我们的 mixins 的方法

如果你想更进一步，你可以使用条件来设置你的 mixins。您只创建一个@mixin 块并设置要传入的参数 - 我们用它来选择断点，如下所示：

```css
@mixin for-size($size) {
  @if $size == phone-only {
    @media (max-width: 599px) {
      @content;
    }
  } @else if $size == tablet-portrait-up {
    @media (min-width: 600px) {
      @content;
    }
  } @else if $size == tablet-landscape-up {
    @media (min-width: 900px) {
      @content;
    }
  } @else if $size == desktop-up {
    @media (min-width: 1200px) {
      @content;
    }
  } @else if $size == big-desktop-up {
    @media (min-width: 1800px) {
      @content;
    }
  }
}
```

然后以这种方式使用我们的 mixins，我们选择它是这样的：

```css
.header-title {
  font-size: 2rem;

  @include for-size(phone-only) {
    font-size: 1rem;
  }
}
```

## 结论

就这么简单！编写媒体查询并不需要头疼。通过使用Sass mixins，我们有一个集中位置来管理我们的媒体查询。处理我们项目的响应性变得更加轻松！

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！