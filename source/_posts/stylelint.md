---
title: styleling
date: 2020-11-20 17:25:33
tags:
  - 工具
author: 左智文
img: https://img.90c.vip/vue-cover/img015.jpg?x-oss-process=image/format,webp
summary: stylelint是一个很强大linter，帮助您避免错误并在样式中强制执行约定。
categories: 规范工具
---

stylelint是一个很强大linter，帮助您避免错误并在样式中强制执行约定。

## 主要特点

- 了解最新的`CSS语法`，包括自定义属性和4级选择器
- 从HTML，markdown和CSS-in-JS对象和模板文字中提取`嵌入式样式`
- 解析类似于`CSS的语法`，例如SCSS，Sass，Less和SugarSS
- 拥有`170多种内置规则`，可捕获错误，应用限制并实施样式约定
- 支持`插件`，因此您可以创建自己的规则或使用社区编写的插件
- 自动`修复`大多数风格违规
- 经过15000多个单元测试的`良好测试`
- 支持可扩展或创建的可`共享配置`
- `不受限制`，因此您可以根据自己的实际需求对其进行自定义
- 有一个不断发展的社区，并被Facebook，GitHub和WordPress使用

## 开始

1. 使用npm安装stylelint及其标准配置

```js
npm install --save-dev stylelint stylelint-config-standard
```

2. 在项目的根目录中创建一个.stylelintrc.json配置文件：

```json
{
  "extends": "stylelint-config-standard"
}
```

3. 例如，对项目中的所有CSS文件运行stylelint：

```js
npx stylelint "**/*.css"
```

这会使您的CSS标准化，以防可能出现错误和样式问题

### 定制

 现在，您可以启动并运行了，您可能想要自定义stylelint以满足您的需求

#### 配置

您需要自定义配置。

例如，您可能想使用流行的

- 如果编写SCSS，可以配置stylelint-config-sass-guidelines
- 如果想给属性排序 可以使用插件stylelint-order

您将在[awesome stylelint](https://github.com/stylelint/awesome-stylelint)中找到更多配置和插件。

要进一步自定义stylelint配置，可以进行调整

- rules
- shared configs
- plugins

> 我们建议您添加限制语言功能的规则，例如单元允许列表，选择器类模式和选择器最大ID。这些强大的规则可用于在代码中强制非风格上的一致性


#### 用法
您不必使用命令行界面。您还可以使用：

- [Node API](https://stylelint.io/user-guide/usage/node-api)
- [PostCSS plugin](https://stylelint.io/user-guide/usage/postcss-plugin)


## 配置

stylelint需要一个配置对象。

stylelint使用[cosmiconfig](https://github.com/davidtheclark/cosmiconfig)查找并加载您的配置对象。从当前工作目录开始，它将查找以下可能的来源：

- package.json中的stylelint属性
- .stylelintrc文件
- 导出JS对象的stylelint.config.js文件
- 导出JS对象的stylelint.config.cjs文件。在JavaScript包中运行stylelint时，在其package.json中指定“ type”：“ module”

找到其中之一后，搜索将停止，stylelint将使用该对象。您可以使用--config或configFile选项来缩短搜索。

.stylelintrc文件（无扩展名）可以为JSON或YAML格式。您可以添加文件扩展名，以帮助您的文本编辑器提供语法检查和突出显示

### 规则

规则决定了linter的寻找。 stylelint内置了170多个规则。

默认情况下未打开任何规则，也没有默认值。您必须明确配置每个规则才能将其打开

rules属性是一个对象，其键是规则名称，值是规则配置。例如
```json
{
  "rules": {
    "color-no-invalid-hex": true
  }
}
```

每个规则配置均符合以下格式之一

- null（关闭规则）
- 单个值（主要选项）
- 具有两个值的数组（[主要选项，次要选项]）

指定主要选项将打开规则

许多规则提供了进一步定制的辅助选项。要设置辅助选项，请使用两成员数组。例如

```json
{
  "rules": {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ]
  }
}
```


您可以在对象中添加任意数量的键。例如，您可以

- 关闭 block-no-empty
- 打开 comment-empty-line-before 具有主要和次要选项
- 使用主要选项打开max-empty-line和unit-allowed-list

```json
{
  "rules": {
    "block-no-empty": null,
    "comment-empty-line-before": [
      "always",
      {
        "ignore": ["stylelint-commands", "after-comment"]
      }
    ],
    "max-empty-lines": 2,
    "unit-allowed-list": ["em", "rem", "%", "s"]
  }
}
```

### 消息

违反规则时，您可以使用message secondary选项来传递自定义消息。

例如，以下规则配置将替代自定义消息

```json
{
  "rules": {
    "color-hex-case": [
      "lower",
      {
        "message": "Lowercase letters are easier to distinguish from numbers"
      }
    ],
    "indentation": [
      2,
      {
        "except": ["block"],
        "message": "Please use 2 spaces for indentation.",
        "severity": "warning"
      }
    ]
  }
}
```

或者，如果需要认真的自定义，则可以`编写自定义格式`以实现最大程度的控制。

### 严重程度

您可以使用严重性二级选项来调整任何特定规则的严重性。

严重性的可用值是

- "warning"
- "error" (default)

例如：

```json
{
  "rules": {
    "indentation": [
      2,
      {
        "except": ["value"],
        "severity": "warning"
      }
    ]
  }
}
```

开发者可以使用这些严重性级别来显示违规或以不同方式退出流程。


### reportDisables

您可以设置reportDisables辅助选项，以报告此规则的任何禁用stylelint的注释，从而有效地禁止作者选择退出

例如：

```json
{
  "rules": {
    "indentation": [
      2,
      {
        "except": ["value"],
        "reportDisables": true
      }
    ]
  }
}
```
该报告被认为是lint错误