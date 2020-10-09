---
title: Linux服务器安装nodejs
date: 2019-05-28 22:54:05
tags:
  - Linux
author: 左智文
img: https://img.90c.vip/other-cover/1039882_2d31_2.jpg?x-oss-process=image/format,webp
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
summary: 本章节，将简单的介绍如何在Linux服务器上部署nodejs。
categories: Linux
---

## 下载

下载源码，你需要在[http://nodejs.org/](http://nodejs.org/)下载最新的Nodejs版本，此处以`node-v10.15.3-linux-x64.tar.xz`版本为例。

![图1](https://img.90c.vip/linux/Snip20190528_1.png?x-oss-process=image/format,webp)

## 解压文件

1. 通过远程工具连接Linux服务并进入指定目录

```js
cd /usr/local
```

2. 将文件传送到该目录并解压文件

```js
tar xvf node-v10.15.3-linux-x64.tar.xz
```

3. 创建软链接，使node和npm命令全局有效。通过创建软链接的方法，使得在任意目录下都可以直接使用node和npm命令：

```js
ln -s /root/node-v10.15.3-linux-x64/bin/node  /usr/local/bin/node
ln -s /root/node-v10.15.3-linux-x64/bin/npm  /usr/local/bin/npm
```

4. 查看并复制路径

```js
# cd usr/local/node-v10.15.3-linux-x64/bin/
# pwd
```

此时命令可以查看到路径如下:

```js
/usr/local/node-v10.15.3-linux-x64/bin
```

>node安装完毕，但是此时输入命令node -v还不能显示版本号，会提示node命令不存在，还需要配置文件。

## 全局环境变量安装

1. 输入命令

```js
vim /etc/profile
```

2. 在vi 环境下 点击 i 进入插入状态，在export PATH的上一行添加如下内容 (环境变量中的内容 是以冒号分割的)

```js
PATH=$PATH:/usr/local/node-v10.15.3-linux-x64/bin
```

3. 编辑完成后按Esc键 然后输入 :wq 按回车保存退出。

![图2](https://img.90c.vip/linux/Snip20190528_5.png?x-oss-process=image/format,webp)

4. 退出vi ，执行`source /etc/profile` 可以是变量生效.

5. 然后执行 echo $PATH ，看看输出内容是否包含自己添加的内容

![图3](https://img.90c.vip/linux/Snip20190528_7.png?x-oss-process=image/format,webp)

## 验证安装

然后到任意目录下去执行一次执行`node -v`和`npm -v`

![图4](https://img.90c.vip/linux/Snip20190528_8.png?x-oss-process=image/format,webp)

至此 nodejs在Linux服务器上安装完成

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
