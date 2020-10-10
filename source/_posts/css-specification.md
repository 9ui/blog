---
title: css命名规范
date: 2019-05-10 17:20:15
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
tags: 规范
img: https://img.90c.vip/sass-cover/css026.jpg?x-oss-process=image/format,webp
author: 左智文
summary: 本章节，整理项目的一些项目中常用的css命名，仅供参考。
categories: 前端
---

## 文本命名规范

```text
index.css: 一般用于首页建立样式

head.css: 头部样式，当多个页面头部设计风格相同时使用。

base.css: 共用样式。

style.css: 独立页面所使用的样式文件。

global.css: 页面样式基础，全局公用样式，页面中必须包含。

layout.css: 布局、版面样式，公用类型较多时使用，一般用在首页级页面和产品类页面中

module.css: 模块，用于产品类页，也可与其它样式配合使用。

master.css: 主要的样式表

columns.css: 专栏样式

themes.css: 主体样式

forms.css: 表单样式

mend.css: 补丁，基于以上样式进行的私有化修补。
```

## 页面结构命名

```text
page: 代表整个页面，用于最外层。

wrap: 外套，将所有元素包在一起的一个外围包，用于最外层

wrapper: 页面外围控制整体布局宽度，用于最外层

container: 一个整体容器，用于最外层

head, header: 页头区域，用于头部

nav: 导航条

content: 内容，网站中最重要的内容区域，用于网页中部主体

main: 网站中的主要区域（表示最重要的一块位置），用于中部主体内容

column: 栏目

sidebar: 侧栏

foot, footer: 页尾、页脚。网站一些附加信息放置区域，（或命名为 copyright）用于底部
```

## 导航命名

```text
nav, navbar, navigation, nav-wrapper: 导航条或导航包，代表横向导航

topnav: 顶部导航

mainbav: 主导航

subnav: 子导航

sidebar: 边导航

leftsidebar 或 sidebar_a: 左导航

rightsidebar 或 sidebar_b: 右导航

title: 标题

summary: 摘要/li>

menu: 菜单，区域包含一般的链接和菜单

submenu: 子菜单

drop: 下拉

dorpmenu: 下拉菜单

links: 链接菜单
```

## 功能命名

```text
logo: 标记网站logo标志

banner: 标语、广告条、顶部广告条

login: 登陆，（例如登录表单：form-login）

loginbar: 登录条

register: 注册

tool, toolbar: 工具条

search: 搜索

searchbar: 搜索条

searchlnput: 搜索输入框

shop: 功能区，表示现在的

icon: 小图标

label: 商标

homepage: 首页

subpage: 二级页面子页面

hot: 热门热点

list: 文章列表，（例如：新闻列表：list-news）

scroll: 滚动

tab: 标签

sitemap: 网站地图

msg 或 message: 提示信息

current: 当前的

joinus: 加入

status: 状态

btn: 按钮，（例如：搜索按钮可写成：btn-search）

tips: 小技巧

note: 注释

guild: 指南

arr, arrow: 标记箭头

service: 服务

breadcrumb: (即页面所处位置导航提示）

download: 下载

vote: 投票

siteinfo: 网站信息

partner: 合作伙伴

link, friendlink: 友情链接

copyright: 版权信息

siteinfoCredits: 信誉

siteinfoLegal: 法律信息
```

## 样式顺序规范

>建议相关的属性说明放在一组，提高代码的可读性。

```text
布局方式、位置，相关属性（position, left, right, top, bottom, z-index）

盒模型，相关属性包括（display, float, width, height, margin, padding, border, border-radius）

文本排版，相关属性包括（font, color, background, line-height, text-align）

视觉外观，相关属性包括：(color, background, list-style, transform, animation)
```

由于定位可以从正常的文档流中移除元素，并且还能覆盖盒模型相关的样式，因此排在首位。而盒模型决定了组件的尺寸和位置，所以排第二位。文本和视觉外观对元素影响较小，所以放在第三，第四位；示例代码如下

```css
.box {
  position: absolute;
  top: 0;
  left: 20%;
  z-index: 99;
  width: 100px;
  height: 100px;
  font-size: 20px;
  color:red;
  background-color: aqua;
}
```

## 使用CSS缩写属性

>对于 background, font, padding, margin 这些简写形式的属性声明，可以缩写的尽量缩写，这样既精简代码又提高用户的阅读体验

```css
.box {
  width: 100px;
  height: 100px;
  margin: 0 10px 20px 30px;
  font: italic bold 12px/30px arial,sans-serif;
}
```

## 小数点和单位

>值在 -1 和 1 之间时去掉小数点前的 “0”，如果属性值为数字 0，不加任何单位；

```css
.box {
  width: 100px;
  height: 100px;
  margin: 0 10px 20px 0;
  opacity: .5;
}
```

## 颜色值十六进制表示法

>6 个字符的十六进制表示法，并始终使用小写的十六进制数字；16进制表示法与rgb表示法混用的情况，优先使用 16 进制表示法

```css
.box {
  color: #cccccc;
  background-color: #efefef;
}
```

## 引号

>属性选择器或属性值用双引号 "" 括起来，而 URI 值 url() 不要使用任何引号

```css
.box {
  font-family: "open sans", arial, sans-serif;
  background-image: url(http://taobao.com/);
}
```

## 内容缩进

>为了反映层级关系和提高可读性，块级内容都应缩进，建议缩进使用两个空格；

```css
.box {
  line-height: 1.5;
}
```

## 空格

> 1. 在每个声明块选择器与左花括号前添加一个空格；
> 2. 声明块的右花括号应当单独成行；
> 3. 每条声明语句的 : 后应该插入一个空格，前面无空格

```css
.box {
  float: right;
  width: 100px;
  color: #333;
  background-color: #f5f5f5;
  text-align: center;
}
```

## 媒体查询

>将媒体查询放在尽可能相关规则的附近。如果分开了，可能会被遗忘。
媒体查询针对每一个种屏幕（大、中、小）的分别单独组织为一个文件

```css
.element {}
.element-avatar {}
.element-selected {}

@media (min-width: 480px) {
    .element {}
    .element-avatar {}
    .element-selected {}
}
```

## 注释

>在适当的位置给予代码正确的注释，让他人跟容易理解。好的代码注释传达上下文和目标。不要简单地重申组件或者 class 名称。

```css
/* Wrapping element for .modal-title and .modal-close */
.modal-header {
}
```

如果是对整个文件做注释，最好放在文本头部，简要描述一下文中元信息以及作用

```css
/**
 * 这里描述元信息
 */
html, body {
  height:100%;
}
```

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！