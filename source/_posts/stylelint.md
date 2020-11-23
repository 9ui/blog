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


### defaultSeverity

您可以为所有未在其次级选项中指定严重性的规则设置默认严重性级别。例如，您可以将默认严重性设置为"warning"

```json
{
  "defaultSeverity": "warning"
}
```

extends

您可以扩展现有配置（无论是您自己的配置还是第三方配置）

流行的配置包括：

- [stylelint-config-recommended](https://github.com/stylelint/stylelint-config-recommended) - 开启可能的[错误规则](https://stylelint.io/user-guide/rules/list#possible-errors)
- [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) - 通过打开60条样式规则来扩展推荐的样式

在[awesome stylelint](https://github.com/stylelint/awesome-stylelint#configs)中，您会发现更多

当一个配置扩展了另一个配置时，它从另一个的属性开始，然后添加并覆盖那里的内容。

例如，您可以扩展[stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)，然后将缩进更改为制表符，然后关闭数字前导零规则：

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "indentation": "tab",
    "number-leading-zero": null
  }
}
```

您可以扩展现有配置的数组,数组中的每个项优先于上一个项（因此第二个项覆盖第一个项中的规则,第三项覆盖第一和第二项中的规则，依此类推，最后一项覆盖其他所有内容。

```json
{
  "extends": ["stylelint-config-standard", "./myExtendableConfig"],
  "rules": {
    "indentation": "tab"
  }
}
```

"extends"的值是最终需要require（）d的“定位符”（或“定位符”数组）。它可以适合Node的require.resolve（）算法使用的任何格式。这意味着“定位器”可以是：

- node_modules中模块的名称（例如stylelint-config-standard；该模块的主文件必须是有效的JSON配置）
- 扩展名为.js或.json的文件的绝对路径（如果您是在Node.js上下文中创建JS对象并将其传递的话，这才有意义）
- 相对于引用配置的具有.js或.json扩展名的文件的相对路径（例如，如果configA具有扩展名：“ ../ configB”，我们将寻找相对于configA的configB）。


plugins

插件是社区构建的规则或规则集，支持方法，工具集，非标准CSS功能或非常特定的用例。

流行的插件包包括:

- [stylelint-order](https://github.com/hudochenkov/stylelint-order)-指定事物的顺序，例如声明块中的属性
- [stylelint-scss](https://github.com/kristerkari/stylelint-scss)-对类似于SCSS的语法强制使用各种规则

在[awesome stylelint](https://github.com/stylelint/awesome-stylelint#plugins)中，您会发现更多

要使用一个插件，请在配置中添加一个“插件”数组，其中包含标识您要使用的插件的“定位器”。与上面的extends一样，“定位器”可以是：

```json
{
  "plugins": ["../special-rule.js"],
  "rules": {
    "plugin-namespace/special-rule": "everything"
  }
}
```

“插件”可以提供单个规则或一组规则。如果您使用的插件提供了一个集合，请在“插件”配置值中调用模块，并使用其在“规则”中提供的规则。例如

```json
{
  "plugins": ["../some-rule-set.js"],
  "rules": {
    "some-rule-set/first-rule": "everything",
    "some-rule-set/second-rule": "nothing",
    "some-rule-set/third-rule": "everything"
  }
}
```

### 处理器

处理器是由社区构建的功能，它们可以挂接到stylelint的管道，在其进入stylelint的过程中修改代码并在其退出时修改结果


我们不鼓励使用内置`语法`，因为处理器与`自动修复`功能不兼容。

要使用一个处理器，请在配置中添加一个“处理器”数组，其中包含标识您要使用的处理器的“定位器”.与上面的extends一样，“定位符”可以是npm模块名称，绝对路径或相对于调用配置文件的路径

```json
{
  "processors": ["stylelint-my-processor"],
  "rules": {}
}
```

如果您的处理器具有选项，则将该项目设置为数组，其第一项为“定位符”，第二项为options对象。

```json
{
  "processors": [
    "stylelint-my-processor",
    ["some-other-processor", { "optionOne": true, "optionTwo": false }]
  ],
  "rules": {}
}
```

处理器也只能与CLI和Node.js API一起使用，而不能与PostCSS插件一起使用。 （PostCSS插件将忽略它们。


### ignoreFiles

您可以提供glob或glob数组来忽略特定文件。

例如，您可以忽略所有JavaScript文件：

```json
{
  "ignoreFiles": ["**/*.js"]
}
```

默认情况下，stylelint忽略node_modules目录。但是，如果设置了ignoreFiles，则此设置将被覆盖。

如果glob是绝对路径，则按原样使用它们。如果它们是相对的，则相对于它们进行分析

- configBasedir（如果提供）
- 配置文件路径，如果配置文件是stylelint发现已加载的文件；
- 或process.cwd（）

`ignoreFiles`属性已从扩展配置中删除：只有根级配置可以忽略文件。

请注意，这不是忽略大量文件的有效方法。如果要有效地忽略很多文件，请使用.stylelintignore或调整文件的全局性。


## rules

内置规则：

- 仅适用于标准CSS语法
- 通常有用；不依赖于特质模式
- 具有清晰明确的成品状态
- 有一个单一的目的
- 是独立的，不依赖其他规则
- 不包含与其他规则重叠的功能

相反，插件是不遵守所有这些条件的社区规则。它可能支持特定的方法论或工具集，或者适用于非标准的构造和功能，或者用于特定的用例

### Options

每个规则都接受一个主选项和一个可选的辅助选项。

### Primary

每个规则都必须有一个主要选项。例如，在：

-  color-hex-case”：“大写”，主要选项是“大写”
- “ indentation”：[2，{“ except”：[“ block”]}]，主要选项是2

### Secondary

一些规则要求额外的灵活性以解决边缘情况。这些可以使用可选的辅助选项对象。例如，在

- “ color-hex-case”：“ upper”没有辅助选项对象
- “ indentation”：[2，{“ except”：[“ block”]}]，主要选项是2

最典型的辅助选项是“忽略”：`[]`和“例外”：`[]`。

关键字“忽略”和“除外”

“ ignore”和“ except”选项接受一系列预定义的关键字选项，例如`[“relative”，“first-nested”，“descendant”]`

- “忽略”跳过特定模式
- “ except”反转特定模式的主要选项

用户定义的“ignore*”

一些规则接受用户定义的要忽略的事物列表。这采用“ ignore <Things>”形式：[]，例如

"ignoreAtRules": [].

ignore *选项使用户可以在配置级别忽略非标准语法。例如，：



