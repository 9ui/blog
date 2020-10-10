---
title: WebP实践之路（其一）
date: 2019-05-01 22:56:03
password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
tags:
 - 性能
author: 左智文
img: https://img.90c.vip/other-cover/1554052_a370.jpg?x-oss-process=image/format,webp
# top: true
summary: 本章节，主要对webp格式的图片做一个简单的介绍。
categories: 前端
---
## Web的新图像格式

WebP是一种现代图像格式，可为Web上的图像提供卓越的无损和有损压缩。使用WebP，网站管理员和Web开发人员可以创建更小，更丰富的图像，使网络更快。与PNG相比，WebP无损图像的尺寸缩小了`26％`。在等效的`SSIM`质量指数下，WebP有损图像比同类JPEG图像小`25-34％`。无损WebP支持透明度（也称为alpha通道），仅需`22％`的额外字节。对于有损RGB压缩可接受的情况，有损WebP也支持透明度，与PNG相比，通常提供3倍小的文件大小。

## WebP如何工作

有损WebP压缩使用预测编码对图像进行编码，这与VP8视频编解码器用于压缩视频中的关键帧的方法相同。预测编码使用相邻像素块中的值来预测块中的值，然后仅对差异进行编码。
无损WebP压缩使用已经看过的图像片段来精确地重建新像素。如果没有找到有趣的匹配，它也可以使用本地调色板。

WebP文件由`VP8`或`VP8L`图像数据和基于RIFF的容器组成。独立的libwebp库充当WebP规范的参考实现，可以从我们的git存储库或作为tarball获得。

## WebP支持

WebP在Google Chrome，Firefox，Edge，Opera浏览器以及许多其他工具和软件库中得到了本机支持。开发人员还增加了对各种图像编辑工具的支持。WebP包括轻量级编码和解码库`libwebp`以及用于将图像转换为WebP格式和从WebP格式转换图像的命令行工具`cwebp`和`dwebp`，以及用于查看，复用和动画WebP图像的工具。完整的源代码可在下载页面上找到。

## WebP转换器下载

通过下载适用于`Linux`，`Windows`或`Mac OS X`的预编译cwebp转换工具，将您喜爱的集合从PNG和JPEG转换为WebP。

在mac下使用`brew install webp`安装
