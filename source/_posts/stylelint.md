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

## 规则

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

- CSS模块中引入的：global和：local伪类
- SCSS中引入的@debug和@extend规则


### Names

规则是一致命名的，它们是：

- 由连字号分隔的小写字母组成
- 分为两部分

第一部分描述了规则适用的内容。第二部分描述了规则正在检查的内容

例如：

```json
"number-leading-zero"
// ↑          ↑
// the thing  what the rule is checking
```

当规则适用于整个样式表时，没有第一部分。

例如：

```json
"no-eol-whitespace"
"indentation"
//    ↑
// what the rules are checking
```

命名规则是为了鼓励显式而非隐式选项.color-hex-case：“upper” |“ lower”，而不是color-hex-uppercase：“always” |“never”。如color-hex-uppercase：“never”表示总是小写，而color-hex-case：“lower”使它明确。

### No rules

大多数规则都要求或禁止某些事情。

例如，数字是否必须带有前导零：


```css
a { line-height: 0.5; }
/**              ↑
 * This leading zero */
 ```

 但是，某些规则只是禁止某些事情。这些规则的名称中包含* -no- *。

 例如，要禁止空块：

- block-no-empty - 块不能为空

```css
a {   }
/** ↑
 * Blocks like this */
 ```

 请注意，选择强制执行相反的选择是没有意义的，即每个块都必须为空。

 ### Max and min rules

 * -max- *和* -min- *规则设置了某些限制。

 例如，在“.”之后指定最大位数：

- number-max-precision: int

```css
a { font-size: 1.333em; }
/**             ↑
 * The maximum number of digits after this "." */
```

### Whitespace rules

空格规则使您可以在样式表的某些特定部分中强制使用空行，单个空格，换行符或不使用空格。

空格规则结合了两组关键字：

- before, after 和 inside，以指定期望在哪里空格（如果有）

- empty-line, space 和 newline 指定在该处是否应使用单个空行，单个空格，单个换行符或不包含空格

例如，指定样式表中的所有注释之前必须是空行还是无空格：

- comment-empty-line-before: string - "always"|"never"

```text
a {}
              ←
/* comment */ ↑
              ↑
/**           ↑
 * This empty line  */
 ```

 此外，一些空格规则还使用其他关键字集：

- 如果目标是事物中的特定标点符号，则使用逗号，冒号，分号，右括号，右括号，右括号，右括号，运算符或范围运算符

例如，指定函数中的逗号后面必须是单个空格还是一个空格：

- function-comma-space-after: string - "always"|"never"

```css
a { transform: translate(1, 1) }
/**                       ↑
 * The space after this commas */
 ```

 标点的复数用于内部规则。例如，指定在函数的括号内必须是单个空格还是没有空格：

- function-parentheses-space-inside: string - "always"|"never"

```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 * The space inside these two parentheses */
 ```

 ### READMEs

 每个规则均随附以下格式的自述文件：

 1. 规则名称
 2. 单行说明
 3. 原型代码示例
 4. 扩展说明（如有必要）
 5. Options.
 6. 被视为违规的示例模式（针对每个选项值）
 7. 不被视为违规的示例模式（针对每个选项值）
 8. 可选选项（如果适用）。

 单行描述的形式为：

 - "Disallow ..." for no rules
 - "Limit ..." for max rules
 - "Require ..." for rules that accept "always" and "never" options
 - "Specify ..." for everything else


 ## Combining rules

 您可以组合规则以实施严格的约定。

 假设您要在每个声明中的冒号前不加空格，而在冒号后仅加一个空格：

 ```css
 a { color: pink; }
/**      ↑
 * No space before and a single space after this colon */
 ```
 您可以使用以下方法实施该操作

```json
{
  "declaration-colon-space-after": "always",
  "declaration-colon-space-before": "never"
}
```

有些东西（例如声明块和值列表）可能跨越多行。在这些情况下，可以使用换行规则和其他选项来提供灵活性。

例如，这是value-list-comma- *规则及其选项的完整集合：

- value-list-comma-space-after: "always"|"never"|"always-single-line"|"never-single-line"
- value-list-comma-space-before: "always"|"never"|"always-single-line"|"never-single-line"
- value-list-comma-newline-after: "always"|"always-multi-line|"never-multi-line"
- value-list-comma-newline-before: "always"|"always-multi-line"|"never-multi-line"

其中* -multi-line和* -single-line是引用值列表（事物）的地方。例如，给定：

```css
a,
b {
  color: red;
  font-family: sans, serif, monospace; /* single-line value list */
}
  /**         ↑                    ↑
  *           ↑                    ↑
  *  The value list starts here and ends here */
 ```

此示例中只有一个单行值列表.选择器是多行的，声明块也是如此，规则也是如此。但是值列表不是。 *-多行和*-单行在此规则的上下文中引用值列表。

### Example A

假设您只想允许单行值列表。而且您想在逗号前不加空格，在逗号后加一个空格：

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red, 2px 2px 1px 1px blue inset, 2px 2px 1px 2px blue inset;
}
```
您可以使用以下方法实施该操作:

```json
{
  "value-list-comma-space-after": "always",
  "value-list-comma-space-before": "never"
}
```

### Example B

假设您要同时允许单行和多行值列表。您希望在单行列表中的逗号后面有一个空格，而在单行和多行列表中的逗号前都没有空格：

```css
a {
  font-family: sans, serif, monospace; /* single-line value list with space after, but no space before */
  box-shadow: 1px 1px 1px red, /* multi-line value list ... */
    2px 2px 1px 1px blue inset, /* ... with newline after, ...  */
    2px 2px 1px 2px blue inset; /* ... but no space before */
}
```

您可以使用以下方法实施该操作:

```json
{
  "value-list-comma-newline-after": "always-multi-line",
  "value-list-comma-space-after": "always-single-line",
  "value-list-comma-space-before": "never"
}
```

### Example C

假设您要同时允许单行和多行值列表。您希望单行列表中的逗号前没有空格，而两个列表中的逗号后总是有空格：

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red
    , 2px 2px 1px 1px blue inset
    , 2px 2px 1px 2px blue inset;
}
```

您可以使用以下方法实施该操作：

```json
{
  "value-list-comma-newline-before": "always-multi-line",
  "value-list-comma-space-after": "always",
  "value-list-comma-space-before": "never-single-line"
}
```

### Example D

这些规则足够灵活，可以对单行和多行列表强制执行完全不同的约定.假设您要同时允许单行和多行值列表.您希望单行列表在冒号前后有一个空格。而您希望多行列表在逗号前有一个换行符，但在其后没有空格：

```css
a {
  font-family: sans , serif , monospace; /* single-line list with a single space before and after the comma */
  box-shadow: 1px 1px 1px red /* multi-line list ... */
    ,2px 2px 1px 1px blue inset /* ... with newline before, ...  */
    ,2px 2px 1px 2px blue inset; /* ... but no space after the comma */
}
```

您可以使用以下方法实施该操作：

```json
{
  "value-list-comma-newline-after": "never-multi-line",
  "value-list-comma-newline-before": "always-multi-line",
  "value-list-comma-space-after": "always-single-line",
  "value-list-comma-space-before": "always-single-line"
}
```

### Example E

假设您要禁用单行块：

```css
  a { color: red; }
/** ↑
 * Declaration blocks like this */
 ```

 使用block-opening-brace-newline-after和block-opening-brace-newline-before规则。例如，此配置：

 ```json
 {
  "block-opening-brace-newline-after": ["always"],
  "block-closing-brace-newline-before": ["always"]
}
```

将允许：

```css
a {
  color: red;
}
```

但不是这些模式：

```css
a { color: red;
}

a {
color: red; }

a { color: red; }
```

要允许单行代码块但对多行代码块强制换行，请对两个规则都使用“ always-multi-line”选项

***-empty-line-before and *-max-empty-lines rules**

这些规则共同作用以控制允许使用空行的位置。

每件事负责将自己推离前一事物，而不是推后一件东西。这种一致性是为了避免冲突，这就是为什么stylelint中没有任何* -empty-line-after规则的原因。

假设您要执行以下操作：


```css
a {
  background: green;
  color: red;

  @media (min-width: 30em) {
    color: blue;
  }
}

b {
  --custom-property: green;

  background: pink;
  color: red;
}
```

您可以执行以下操作:

```json
{
  "at-rule-empty-line-before": [
    "always",
    {
      "except": ["first-nested"]
    }
  ],
  "custom-property-empty-line-before": [
    "always",
    {
      "except": ["after-custom-property", "first-nested"]
    }
  ],
  "declaration-empty-line-before": [
    "always",
    {
      "except": ["after-declaration", "first-nested"]
    }
  ],
  "block-closing-brace-empty-line-before": "never",
  "rule-empty-line-before": ["always-multi-line"]
}
```
我们建议您将主要选项（例如`always`或`never`）设置为最常见的情况，并使用可选的次要选项定义例外.除了选项外，有很多值，例如先嵌套，后注释等.

`* -empty-line-before`规则控制在某事物之前是否绝对不能有空行或是否必须有一个或多个空行.`* -max-`空行规则通过控制事物中空行的数量来补充这一点。
`max-empty-lines`规则为整个源设置了限制。然后，可以使用诸如`function-max-empty-lines`, `selector-max-empty-lines` and `value-list-max-empty-lines`之类的东西来设置更严格的限制。


例如，假设您要强制执行以下操作：

```json
a,
b {
  box-shadow:
    inset 0 2px 0 #dcffa6,
    0 2px 5px #000;
}

c {
  transform:
    translate(
      1,
      1
    );
}
```
即整个源中最多有1个空行，但函数，选择器列表和值列表中没有空行。

您可以执行以下操作：

```json
{
  "function-max-empty-lines": 0,
  "max-empty-lines": 1,
  "selector-list-max-empty-lines": 0,
  "value-list-max-empty-lines": 0
}
```

***-allowed-list, *-disallowed-list, color-named and applicable *-no-* rules**

这些规则共同作用以（禁止）语言功能和结构。

有* -allowed-list和* -disallowed-list规则针对CSS语言的构造：规则，函数，声明（即属性-值对）,属性和单位。这些规则（禁止）允许使用这些结构的任何语言功能（例如@media，rgb（））.
但是，有些功能没有被这些* -allowed-list和* -disallowed-list规则捕获（或者确实存在，但需要使用复杂的正则表达式进行配置）.有个别规则，通常是* -no- *规则（例如color-no-hex和选择器-no-id），
以禁止使用这些功能。

假设您要禁止@debug语言扩展。您可以使用at-rule-disallowed-list或at-rule-allowed-list规则来执行此操作，因为@debug语言扩展使用at-rule构造，例如

```json
{
  "at-rule-disallowed-list": ["debug"]
}
```

假设无论出于何种原因，您都想禁止整个规则构造。您可以使用以下方法做到这一点：

```json
{
  "at-rule-allowed-list": []
}
```
假设您要禁止边框属性的值none。您可以使用声明属性值不允许列表或声明属性值允许列表来执行此操作，例如

```json
{
  "declaration-property-value-disallowed-list": [
    {
      "/^border/": ["none"]
    }
  ]
}
```
**color-* and function-* rules**

大多数<color>值都是函数。这样，可以使用功能允许列表规则或功能不允许列表规则来（禁止）使用它们。其他两种颜色表示均无效：命名颜色和十六进制颜色.有两个禁止（禁止）使用的特定规则：分别为颜色命名和不以十六进制表示的颜色。

假设您要强制使用命名的颜色（如果您选择的颜色存在一种颜色），而要使用hwb的颜色（例如，不存在），例如：

```css
a {
  background: hwb(235, 0%, 0%); /* there is no named color equivalent for this color */
  color: black;
}
```

如果您采用允许的方法，则可以使用以下方法：

```json
{
  "color-named": "always-where-possible",
  "color-no-hex": true,
  "function-allowed-list": ["hwb"]
}
```
或者，如果您采用不允许的方法：

```json
{
  "color-named": "always-where-possible",
  "color-no-hex": true,
  "function-disallowed-list": ["/^rgb/", "/^hsl/", "gray"]
}
```

这种方法可以扩展到何时使用语言扩展（使用两个内置的规则和功能的可扩展语法结构）.例如，假设您要禁止使用所有自定义颜色表示功能（例如，我的颜色（红色，带有绿色的虚线/ 5％）。您可以执行以下操作：

```json
{
  "color-named": "never",
  "color-no-hex": true,
  "function-allowed-list": ["my-color"]
}
```

### 处理冲突

每个规则都是独立的，因此有时可以配置规则以使它们彼此冲突。例如，您可以打开两个冲突的允许和禁止列表规则，例如允许单位列表和不允许单位列表。

作为配置作者，您有责任解决这些冲突。

## Using regex in rules

以下规则类别支持正则表达式：

- *-allowed-list
- *-disallowed-list
- *-pattern

忽略*次要选项也是如此。



### Enforce a case

您可以使用与所选大小写约定相对应的正则表达式：

- kebab-case: ^([a-z][a-z0-9]*)(-[a-z0-9]+)*$
- lowerCamelCase: ^[a-z][a-zA-Z0-9]+$
- snake_case: ^([a-z][a-z0-9]*)(_[a-z0-9]+)*$
- UpperCamelCase: ^[A-Z][a-zA-Z0-9]+$

例如，对于LowerCamelCase类选择器，请使用“ selector-class-pattern”：“ ^ [a-z] [a-zA-Z0-9] + $”。

所有这些模式均不允许CSS标识符以数字，两个连字符或连字符后跟一个数字开头

### Enforce a prefix
您可以使用否定的前瞻正则表达式来确保前缀。

例如，要确保所有自定义属性均以my-开头，请使用“ custom-property-pattern”：“ ^（?! my-）”。

## List of rules

首先按以下类别分组，然后按它们适用的thing分组

- 可能的错误
- 限制语言功能
- 风格问题


### 可能的错误

#### Color

- color-no-invalid-hex: 禁止使用无效的十六进制颜色

#### Font family
- font-family-no-duplicate-names: 禁止使用重复的字体系列名称。
- font-family-no-missing-generic-family-keyword: 禁止在字体系列名称列表中缺少通用系列

#### String

- string-no-newline: 禁止在字符串中使用（未转义的）换行符

#### Unit

- unit-no-unknown: 禁止使用未知单位.

#### Property

- property-no-unknown: 禁止未知属性

#### Keyframe declaration

- keyframe-declaration-no-important: 在关键帧声明中禁止！important。

#### Declaration block

- declaration-block-no-duplicate-properties: 禁止在声明块中使用重复属性。
- declaration-block-no-shorthand-property-overrides: 禁止覆盖相关的速记属性的速记属性


#### Block

block-no-empty: 禁止空块。


#### Selector

- selector-pseudo-class-no-unknown: 禁止使用未知的伪类选择器。
- selector-pseudo-element-no-unknown: 禁止使用未知的伪元素选择器。
- selector-type-no-unknown: 禁止使用未知类型选择器。


#### Media feature

- media-feature-name-no-unknown: 禁止使用未知的媒体功能名称。

#### At-rule

- at-rule-no-unknown: 禁止使用未知规则。

#### Comment

- comment-no-empty: 禁止空评论。

#### General / Sheet

- no-descending-specificity: 禁止较低特异性的选择器在覆盖较高特异性的选择器之后出现。
- no-duplicate-at-import-rules: 禁止在样式表中使用重复的@import规则。
- no-duplicate-selectors: 禁止在样式表中使用重复的选择器。
- no-empty-source: 禁止空来源。
- no-extra-semicolons: 禁止使用多余的分号（可自动修复）。
- no-invalid-double-slash-comments: 禁止CSS不支持的双斜杠注释（// ...）。

### 限制语言功能

#### Alpha-value

- alpha-value-notation: 为Alpha值指定百分比或数字符号（可自动修复）

#### Hue
- hue-degree-notation: 指定色调的数字或角度符号（可自动修复）

#### Color

- color-function-notation: 为适用的颜色功能指定现代或旧式表示法（可自动修复）
- color-named: 要求（如果可能）或禁止命名的颜色。
- color-no-hex: 禁止使用十六进制颜色

#### Length

- length-zero-no-unit: 不允许长度为零的单位（可自动修复）。

#### Font weight

- font-weight-notation: 需要数字或命名（尽可能）的字体粗细值。另外，当需要命名值时，仅需要有效名称。

#### Function

- function-allowed-list: 指定允许的功能列表。
- function-blacklist: 指定禁止的功能列表。 （已弃用）
- function-disallowed-list: 指定禁止的功能列表。
- function-url-no-scheme-relative: 禁止使用相对于方案的网址。
- function-url-scheme-allowed-list: 指定允许的URL方案的列表
- function-url-scheme-blacklist: 指定不允许的URL方案列表。 （已弃用）
- function-url-scheme-disallowed-list: 指定不允许的URL方案列表。
- function-url-scheme-whitelist: 指定允许的URL方案的列表。 （已弃用）
- function-whitelist: 指定允许的功能列表。 （已弃用）

#### Keyframes

- keyframes-name-pattern: 指定关键帧名称的模式。

#### Number

- number-max-precision: 限制数字中允许的小数位数。

#### Time

- time-min-milliseconds: 指定时间值的最小毫秒数。

#### Unit

- unit-allowed-list: 指定允许的单位列表。
- unit-blacklist: 指定不允许的单位列表。 （已弃用）
- unit-disallowed-list: 指定不允许的单位列表。
- unit-whitelist: 指定允许的单位列表。 （已弃用）

#### Shorthand property

- shorthand-property-no-redundant-values: 禁止在速记属性中使用冗余值（可自动修复）。

#### Value

- value-no-vendor-prefix: 禁止使用值的供应商前缀（可自动修复）。

#### Custom property

custom-property-pattern: 指定自定义属性的模式。

#### Property

- property-allowed-list: 指定允许的属性列表。
- property-blacklist: 指定不允许的属性列表。 （已弃用）
- property-disallowed-list: 指定不允许的属性列表。
- property-no-vendor-prefix: 禁止使用属性的供应商前缀（可自动修复）。
- property-whitelist: 指定允许的属性列表。 （已弃用）

#### Declaration

- declaration-block-no-redundant-longhand-properties: 禁止将可合并为一个速记属性的速记属性。
- declaration-no-important: 在声明中禁止！important。
- declaration-property-unit-allowed-list: 在声明中指定允许的属性和单元对的列表。
- declaration-property-unit-blacklist: 在声明中指定不允许的属性和单元对的列表。 （已弃用）
- declaration-property-unit-disallowed-list: 在声明中指定不允许的属性和单元对的列表。
- declaration-property-unit-whitelist: 在声明中指定允许的属性和单元对的列表。 （已弃用）
- declaration-property-value-allowed-list: 在声明中指定允许的属性和值对的列表。
- declaration-property-value-blacklist: 在声明中指定不允许的属性和值对的列表。 （已弃用）
- declaration-property-value-disallowed-list: 在声明中指定不允许的属性和值对的列表。
- declaration-property-value-whitelist: 在声明中指定允许的属性和值对的列表。 （已弃用）

#### Declaration block

- declaration-block-single-line-max-declarations: 限制单行声明块中的声明数量。

#### Selector

- selector-attribute-name-disallowed-list: 指定不允许的属性名称的列表。
- selector-attribute-operator-allowed-list: 指定允许的属性运算符的列表。
- selector-attribute-operator-blacklist: 指定不允许的属性运算符的列表。 （已弃用）
- selector-attribute-operator-disallowed-list: 指定不允许的属性运算符的列表。
- selector-attribute-operator-whitelist: 指定允许的属性运算符的列表。 （已弃用）
- selector-class-pattern: 为类选择器指定一个模式。
- selector-combinator-allowed-list: 指定允许的组合器列表。
- selector-combinator-blacklist: 指定不允许的组合器列表。 （已弃用）
- selector-combinator-disallowed-list: 指定不允许的组合器列表。
- selector-combinator-whitelist: 指定允许的组合器列表。 （已弃用）
- selector-id-pattern: 指定ID选择器的模式。
- selector-max-attribute: 限制选择器中属性选择器的数量。
- selector-max-class: 限制选择器中的类数。
- selector-max-combinators: 限制选择器中组合器的数量。
- selector-max-compound-selectors: 限制选择器中复合选择器的数量。
- selector-max-empty-lines: 限制选择器中相邻空行的数量（可自动修复）。
- selector-max-id: 限制选择器中ID选择器的数量。
- selector-max-pseudo-class: 限制选择器中伪类的数量。
- selector-max-specificity: 限制选择器的特异性
- selector-max-type: 限制选择器中的类型数。
- selector-max-universal: 限制选择器中通用选择器的数量。
- selector-nested-pattern: 为嵌套在规则内的规则选择器指定一个模式。
- selector-no-qualifying-type: 禁止按类型限定选择器。
- selector-no-vendor-prefix: 禁止选择器的供应商前缀（可自动修复）。
- selector-pseudo-class-allowed-list: 指定允许的伪类选择器的列表。
- selector-pseudo-class-blacklist: 指定不允许的伪类选择器的列表。 （已弃用）
- selector-pseudo-class-disallowed-list: 指定不允许的伪类选择器的列表。
- selector-pseudo-class-whitelist: 指定允许的伪类选择器的列表。 （已弃用）
- selector-pseudo-element-allowed-list: 指定允许的伪元素选择器列表。
- selector-pseudo-element-blacklist: 指定一个不允许的伪元素选择器列表。 （已弃用）
- selector-pseudo-element-colon-notation: 为适用的伪元素指定单冒号或双冒号表示法（可自动修复）。
- selector-pseudo-element-disallowed-list: 指定不允许的伪元素选择器列表。
- selector-pseudo-element-whitelist: 指定允许的伪元素选择器列表。 （已弃用）

#### Media feature

- media-feature-name-allowed-list: 指定允许的媒体功能名称列表。
- media-feature-name-blacklist: 指定不允许的媒体功能名称列表。 （已弃用）
- media-feature-name-disallowed-list: 指定不允许的媒体功能名称列表。
- media-feature-name-no-vendor-prefix: 禁止使用媒体功能名称的供应商前缀（可自动修复）。
- media-feature-name-value-allowed-list: 指定允许的媒体功能名称和值对的列表。
- media-feature-name-value-whitelist: 指定允许的媒体功能名称和值对的列表。 （已弃用）
- media-feature-name-whitelist: 指定允许的媒体功能名称列表。 （已弃用）

#### Custom media
- custom-media-pattern: Specify a pattern for custom media query names.

#### At-rule
- at-rule-allowed-list: Specify a list of allowed at-rules.
- at-rule-blacklist: Specify a list of disallowed at-rules. (deprecated)
- at-rule-disallowed-list: Specify a list of disallowed at-rules.
- at-rule-no-vendor-prefix: Disallow vendor prefixes for at-rules (Autofixable).
- at-rule-property-required-list: Specify a list of required properties for an at-rule.
- at-rule-property-requirelist: Specify a list of required properties for an at-rule. (deprecated)
- at-rule-whitelist: Specify a list of allowed at-rules. (deprecated)

#### Comment
- comment-pattern: Specify a pattern for comments.
- comment-word-blacklist: Specify a list of disallowed words within comments. (deprecated)
- comment-word-disallowed-list: Specify a list of disallowed words within comments.

#### General / Sheet
- max-nesting-depth: Limit the depth of nesting.
- no-unknown-animations: Disallow unknown animations.

### 风格问题

#### Color
- color-hex-case: Specify lowercase or uppercase for hex colors (Autofixable).
- color-hex-length: Specify short or long notation for hex colors (Autofixable).

#### Font family
- font-family-name-quotes: Specify whether or not quotation marks should be used around font family names.

#### Function
- function-comma-newline-after: Require a newline or disallow whitespace after the commas of functions (Autofixable).
- function-comma-newline-before: Require a newline or disallow whitespace before the commas of functions (Autofixable).
- function-comma-space-after: Require a single space or disallow whitespace after the commas of functions (Autofixable).
- function-comma-space-before: Require a single space or disallow whitespace before the commas of functions (Autofixable).
- function-max-empty-lines: Limit the number of adjacent empty lines within functions (Autofixable).
- function-name-case: Specify lowercase or uppercase for function names (Autofixable).
- function-parentheses-newline-inside: Require a newline or disallow whitespace on the inside of the parentheses of functions (Autofixable).
- function-parentheses-space-inside: Require a single space or disallow whitespace on the inside of the parentheses of functions (Autofixable).
- function-url-quotes: Require or disallow quotes for urls.
- function-whitespace-after: Require or disallow whitespace after functions (Autofixable).

#### Number
- number-leading-zero: Require or disallow a leading zero for fractional numbers less than 1 (Autofixable).
- number-no-trailing-zeros: Disallow trailing zeros in numbers (Autofixable).

#### String
- string-quotes: Specify single or double quotes around strings (Autofixable).

#### Unit
- unit-case: Specify lowercase or uppercase for units (Autofixable).

#### Value
- value-keyword-case: Specify lowercase or uppercase for keywords values (Autofixable).

#### Value list
- value-list-comma-newline-after: Require a newline or disallow whitespace after the commas of value lists (Autofixable).
- value-list-comma-newline-before: Require a newline or disallow whitespace before the commas of value lists.
- value-list-comma-space-after: Require a single space or disallow whitespace after the commas of value lists (Autofixable).
- value-list-comma-space-before: Require a single space or disallow whitespace before the commas of value lists (Autofixable).
- value-list-max-empty-lines: Limit the number of adjacent empty lines within value lists (Autofixable).

#### Custom property
- custom-property-empty-line-before: Require or disallow an empty line before custom properties (Autofixable).

#### Property
- property-case: Specify lowercase or uppercase for properties (Autofixable).

#### Declaration
- declaration-bang-space-after: Require a single space or disallow whitespace after the bang of declarations (Autofixable).
- declaration-bang-space-before: Require a single space or disallow whitespace before the bang of declarations (Autofixable).
- declaration-colon-newline-after: Require a newline or disallow whitespace after the colon of declarations (Autofixable).
- declaration-colon-space-after: Require a single space or disallow whitespace after the colon of declarations (Autofixable).
- declaration-colon-space-before: Require a single space or disallow whitespace before the colon of declarations (Autofixable).
- declaration-empty-line-before: Require or disallow an empty line before declarations (Autofixable).

#### Declaration block
- declaration-block-semicolon-newline-after: Require a newline or disallow whitespace after the semicolons of declaration blocks (Autofixable).
- declaration-block-semicolon-newline-before: Require a newline or disallow whitespace before the semicolons of declaration blocks.
- declaration-block-semicolon-space-after: Require a single space or disallow whitespace after the semicolons of declaration blocks (Autofixable).
- declaration-block-semicolon-space-before: Require a single space or disallow whitespace before the semicolons of declaration blocks (Autofixable).
- declaration-block-trailing-semicolon: Require or disallow a trailing semicolon within declaration blocks (Autofixable).

#### Block
- block-closing-brace-empty-line-before: Require or disallow an empty line before the closing brace of blocks (Autofixable).
- block-closing-brace-newline-after: Require a newline or disallow whitespace after the closing brace of blocks (Autofixable).
- block-closing-brace-newline-before: Require a newline or disallow whitespace before the closing brace of blocks (Autofixable).
- block-closing-brace-space-after: Require a single space or disallow whitespace after the closing brace of blocks.
- block-closing-brace-space-before: Require a single space or disallow whitespace before the closing brace of blocks (Autofixable).
- block-opening-brace-newline-after: Require a newline after the opening brace of blocks (Autofixable).
- block-opening-brace-newline-before: Require a newline or disallow whitespace before the opening brace of blocks (Autofixable).
- block-opening-brace-space-after: Require a single space or disallow whitespace after the opening brace of blocks (Autofixable).
- block-opening-brace-space-before: Require a single space or disallow whitespace before the opening brace of blocks (Autofixable).

#### Selector
- selector-attribute-brackets-space-inside: Require a single space or disallow whitespace on the inside of the brackets within attribute selectors (Autofixable).
- selector-attribute-operator-space-after: Require a single space or disallow whitespace after operators within attribute selectors (Autofixable).
- selector-attribute-operator-space-before: Require a single space or disallow whitespace before operators within attribute selectors (Autofixable).
- selector-attribute-quotes: Require or disallow quotes for attribute values.
- selector-combinator-space-after: Require a single space or disallow whitespace after the combinators of selectors (Autofixable).
- selector-combinator-space-before: Require a single space or disallow whitespace before the combinators of selectors (Autofixable).
- selector-descendant-combinator-no-non-space: Disallow non-space characters for descendant combinators of selectors (Autofixable).
- selector-pseudo-class-case: Specify lowercase or uppercase for pseudo-class selectors (Autofixable).
- selector-pseudo-class-parentheses-space-inside: Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors (Autofixable).
- selector-pseudo-element-case: Specify lowercase or uppercase for pseudo-element selectors (Autofixable).
- selector-type-case: Specify lowercase or uppercase for type selectors (Autofixable).

#### Selector list
- selector-list-comma-newline-after: Require a newline or disallow whitespace after the commas of selector lists (Autofixable).
- selector-list-comma-newline-before: Require a newline or disallow whitespace before the commas of selector lists (Autofixable).
- selector-list-comma-space-after: Require a single space or disallow whitespace after the commas of selector lists (Autofixable).
- selector-list-comma-space-before: Require a single space or disallow whitespace before the commas of selector lists (Autofixable).

#### Rule
- rule-empty-line-before: Require or disallow an empty line before rules (Autofixable).

#### Media feature
- media-feature-colon-space-after: Require a single space or disallow whitespace after the colon in media features (Autofixable).
- media-feature-colon-space-before: Require a single space or disallow whitespace before the colon in media features (Autofixable).
- media-feature-name-case: Specify lowercase or uppercase for media feature names (Autofixable).
- media-feature-parentheses-space-inside: Require a single space or disallow whitespace on the inside of the parentheses within media features (Autofixable).
- media-feature-range-operator-space-after: Require a single space or disallow whitespace after the range operator in media features (Autofixable).
- media-feature-range-operator-space-before: Require a single space or disallow whitespace before the range operator in media features (Autofixable).

#### Media query list
- media-query-list-comma-newline-after: Require a newline or disallow whitespace after the commas of media query lists (Autofixable).
- media-query-list-comma-newline-before: Require a newline or disallow whitespace before the commas of media query lists.
- media-query-list-comma-space-after: Require a single space or disallow whitespace after the commas of media query lists (Autofixable).
- media-query-list-comma-space-before: Require a single space or disallow whitespace before the commas of media query lists (Autofixable).

####  At-rule
- at-rule-empty-line-before: Require or disallow an empty line before at-rules (Autofixable).
- at-rule-name-case: Specify lowercase or uppercase for at-rules names (Autofixable).
- at-rule-name-newline-after: Require a newline after at-rule names.
- at-rule-name-space-after: Require a single space after at-rule names (Autofixable).
- at-rule-semicolon-newline-after: Require a newline after the semicolon of at-rules (Autofixable).
- at-rule-semicolon-space-before: Require a single space or disallow whitespace before the semicolons of at-rules.

#### Comment
- comment-empty-line-before: Require or disallow an empty line before comments (Autofixable).
- comment-whitespace-inside: Require or disallow whitespace on the inside of comment markers (Autofixable).

#### General / Sheet
- indentation: Specify indentation (Autofixable).
- linebreaks: Specify unix or windows linebreaks (Autofixable).
- max-empty-lines: Limit the number of adjacent empty lines (Autofixable).
- max-line-length: Limit the length of a line.
- no-eol-whitespace: Disallow end-of-line whitespace (Autofixable).
- no-missing-end-of-source-newline: Disallow missing end-of-source newlines (Autofixable).
- no-empty-first-line: Disallow empty first lines (Autofixable).
- unicode-bom: Require or disallow Unicode BOM.