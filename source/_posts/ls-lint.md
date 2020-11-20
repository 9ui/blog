---
title: ls-lint
date: 2020-11-20 16:14:06
tags:
  - 工具
author: 左智文
img: https://img.90c.vip/js-cover/1705248_a6d3.jpg?x-oss-process=image/format,webp
summary: ls-lint是一个非常快的文件和目录名称linter，它提供了一种简单快速的方法来将某些结构带到您的项目目录中。
categories: 规范工具
---

ls-lint是一个非常快的文件和目录名称linter，它提供了一种简单快速的方法来将某些结构带到您的项目目录中。

### 主要特点

- 在一个`.ls-lint.yml`文件中管理的简单规则的最小设置
- 适用于目录和文件名-支持所有扩展名-完全支持unicode
- 速度超快-数毫秒内可删除数千个文件和目录
- 支持`Windows`，`MacOS`和`Linux + NPM`软件包和`Docker`映像
- 受到`Vue.js 3`，`Nuxt.j`s，`Vant`等的信任
- 几乎零第三方依赖关系-仅`go-yaml`和`doublestar`

### 安装

Linux

```bush
curl -sL -o ls-lint https://github.com/loeffel-io/ls-lint/releases/download/v1.9.0/ls-lint-linux && chmod +x ls-lint && ./ls-lint
```

MacOS

```js
curl -sL -o ls-lint https://github.com/loeffel-io/ls-lint/releases/download/v1.9.0/ls-lint-darwin && chmod +x ls-lint && ./ls-lint
```

Windows [手动下载](https://github.com/loeffel-io/ls-lint/releases/download/v1.9.0/ls-lint-windows.exe)

```js
ls-lint-windows.exe
```

NPM [Package](https://www.npmjs.com/package/@ls-lint/ls-lint)

```js
npm install -g @ls-lint/ls-lint # global
npm install @ls-lint/ls-lint # local
```

Run

```js
ls-lint # global
node_modules/.bin/ls-lint # local - use backslashs for windows
```

NPX

```bush
npx @ls-lint/ls-lint
```


Docker [Image](https://hub.docker.com/r/lslintorg/ls-lint)

```bush
docker run -t -v /path/to/project:/data lslintorg/ls-lint:v1.9.0
```

### 基础用法

- 创建配置
- 扩展和子扩展
- 全局配置
- 整理目录名称
- 使用多个规则
- 不同目录的不同规则
- 使用目录模式
  - 全局替换
  - 局部替换

#### 创建配置

您的ls-lint配置必须位于项目根目录中的.ls-lint.yml文件中，并提供两个选项

`.ls-lint.yml`

```yml
  ls:
      ...

  ignore:
      ...
```

> `ls` 使用扩展，子扩展和目录的所有规则定义项目目录的结构 `ignore `可以完全忽略其中的某些文件和目录

#### 扩展和子扩展

项目的全局配置是可选的，但可能是最佳解决方案.假设您要定义所有.js，.ts和.d.ts项目文件都必须在`kebab-case`样式，但您想忽略.git和node_modules目录-可以这样解决

`.ls-lint.yml`
```yml
ls:
    .js: kebab-case
    .ts: kebab-case
    .d.ts: kebab-case

ignore:
    - .git
    - node_modules
```

很简单，不是吗？

#### 整理目录名称

您还可以通过.dir定义来定义目录规则


`.ls-lint.yml`
```yml
ls:
    packages/src:
        .dir: kebab-case # applies for the current directory and all their subdirectories
        .js: kebab-case
```

#### 不同目录的不同规则

通常，不同目录有不同的规则，或者您只想为某些特定目录定义规则

`.ls-lint.yml`
```yml
ls:
    .js: kebab-case

    models:
        .js: PascalCase

    src/templates:
        .js: snake_case
```

> 记住 目录配置（例如模型或src / templates）将覆盖当前目录及其所有子目录的所有规则

#### 使用目录模式

- 全局匹配

全局模式*或**可用于所有ls目录配置

`.ls-lint.yml`
```yaml
ls:
    packages/*/src: # matches any sequence of non-path-separators
        .js: kebab-case

    packages/**/templates: # matches any sequence of characters, including path separators
        .html: kebab-case
```

- 局部匹配
局部模式可用于所有ls目录配置：
`.ls-lint.yml`
```yml
ls:
    packages/*/{src,tests}: # matches a sequence of characters if one of the comma-separated alternatives matches
        .js: kebab-case
```

### 规则

- 概括
- 正则表达式

#### 概括

ls-lint提供了多个开箱即用的规则

| 规则 | 别名 | 描述 |
| :---:  |:-- |:--    |
| regex | - | 匹配正则表达式模式：^ {pattern} $|
| lowercase | - |  每个字母必须小写 忽略非字母|
| camelcase | camelCase | 字符串必须为camelCase 只允许使用字母和数字|
| pascalcase | PascalCase| 字符串必须为Pascalcase 只允许使用字母和数字|
| snakecase | 	snake_case| 字符串必须为snake_case 只允许使用小写字母，数字和_|
| kebabcase | kebab-case | 字符串必须为kebab-case 仅小写字母，数字和-允许|
| pointcase | point.case| 字符串必须为“小写” 仅小写字母，数字和.允许的|

#### 正则表达式

regex规则为您的配置提供了充分的灵活性，并通过^ {pattern} $模式匹配您的文件名和目录名

##### 示例

`.ls-lint.yml`
```yml
ls:
    .js: regex:[a-z0-9]+ # the final regex pattern will be ^[a-z0-9]+$
```

##### 使用多个正则表达式规则

`|` 支持多个正则表达式规则

`.ls-lint.yml`
```yml
ls:
    .js: regex:Schema(\.test)? | regex:Resolver(\.test)?
```


