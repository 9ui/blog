---
title: 日常刷题(01)
date: 2019-06-18 17:19:15
tags: 日常刷题
img: https://img.90c.vip/js-cover/1705248_a6d3.jpg?x-oss-process=image/format,webp
author: 左智文
summary: 日常刷题，题目的解决方法不唯一，仅供参考，若有问题或疑问请随时联系博主。
categories: 前端
---

## 等值线图

> 等值线图是没有重复字母，连续或非连续的字。实现一个函数，确定只包含字母的字符串是否是等值线图。假设空字符串是等值线图。忽略字母案例。

```js
isIsogram("Dermatoglyphics") == true;
isIsogram("aba") == false;
isIsogram("moOse") == false; // -- ignore letter case
```

> 代码如下

```js
function isIsogram(str) {
  // 定义一个空对象
  let has = {};

  // 将字符串转化为数组
  let strArray = str.toLowerCase().split("");

  // 判断其中是否存在重复值并转化对象
  let isRepeatObj = strArray.reduce((accumulator, currentValue, idx) => {
    has[currentValue] = !has[currentValue];
    return has;
  }, {});

  // 使用every找出是否完全存在不重复项
  var isO = Object.values(isRepeatObj).every(item => {
    return item == true;
  });

  return isO;
}
```

> 测试结果

```js
Test.assertSimilar(isIsogram("Dermatoglyphics"), true);
Test.assertSimilar(isIsogram("isogram"), true);
Test.assertSimilar(isIsogram("aba"), false, "same chars may not be adjacent");
Test.assertSimilar(
  isIsogram("moOse"),
  false,
  "same chars may not be same case"
);
Test.assertSimilar(isIsogram("isIsogram"), false);
Test.assertSimilar(isIsogram(""), true, "an empty string is a valid isogram");
```

## 找到奇偶校验异常值

> 您将获得一个包含整数的数组（其长度至少为 3，但可能非常大）。该数组要么完全由奇数整数组成，要么完全由偶数整数组成，除了单个整数 N.编写一个方法，将数组作为参数并返回该“异常值”N.

```js
[2, 4, 0, 100, 4, 11, 2602, 36]
Should return: 11 (the only odd number)

[160, 3, 1719, 19, 11, 13, -21]
Should return: 160 (the only even number)
```

> 代码如下

```js
function findOutlier(integers) {
  // 定义一个单数的数组
  let odd = [];
  // 定义一个双数的数组
  let even = [];

  integers.map(item => {
    if (item % 2 === 0) {
      even.push(item);
    } else {
      odd.push(item);
    }
  });

  const counts = odd.length > even.length ? even[0] : odd[0];
  return counts;
}
```

> 测试结果

```js
Test.assertEquals(findOutlier([0, 1, 2]), 1);
Test.assertEquals(findOutlier([1, 2, 3]), 2);
Test.assertEquals(findOutlier([2, 6, 8, 10, 3]), 3);
Test.assertEquals(findOutlier([0, 0, 3, 0, 0]), 3);
Test.assertEquals(findOutlier([1, 1, 0, 1, 1]), 0);
```
