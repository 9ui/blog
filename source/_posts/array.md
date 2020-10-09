---
title: 变异数组
date: 2019-05-12 00:42:01
tags: vue
author: 左智文
summary: 本章节，我们将使用vm.$set实现vue的双向数据绑定。
img: https://img.90c.vip/vue-cover/img008.jpg?x-oss-process=image/format,webp
categories: vue
---

## 力有不逮的对象

众所周知，在 Vue 中，直接修改对象属性的值无法触发响应式。当你直接修改了对象属性的值，你会发现，只有数据改了，但是页面内容并没有改变。

这是什么原因？

原因在于： Vue 的响应式系统是基于 `Object.defineProperty` 这个方法的，该方法可以监听对象中某个元素的获取或修改，经过了该方法处理的数据，我们称其为响应式数据。但是，该方法有一个很大的缺点，新增属性或者删除属性不会触发监听，举个栗子：

```js
var vm = new Vue({
  data() {
    return {
      obj: {
        a: 1
      }
    };
  }
});
// `vm.obj.a` 现在是响应式的

vm.obj.b = 2;
// `vm.obj.b` 不是响应式的
```

原因在于，在 Vue 初始化的时候， Vue 内部会对 data 方法的返回值进行深度响应式处理，使其变为响应式数据，所以， vm.obj.a 是响应式的。但是，之后设置的 vm.obj.b 并没有经过 Vue 初始化时响应式的洗礼，所以，理所应当的不是响应式。

那么，vm.obj.b 可以变成响应式吗？当然可以，通过 `vm.$set` 方法就可以完美地实现要求，在此不再赘述相关原理了，之后应该会写一篇文章讲述 `vm.$set` 背后的原理。

## 更凄惨的数组

上面说了这么多，还没有提到本篇文章的主角——数组，现在该主角出场了。

比起对象，数组的境遇更加凄惨一些，看看官方文档：

> 由于 JavaScript 的限制， Vue 不能检测以下变动的数组：
>
> 1. 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
> 2. 当你修改数组的长度时，例如：vm.items.length = newLength

```js
var vm = new Vue({
  data() {
    return {
      items: ["a", "b", "c"]
    };
  }
});
vm.items[1] = "x"; // 不是响应性的
vm.items.length = 2; // 不是响应性的
```

也就是说，数组连自身元素的修改也无法监听，原因在于， Vue 对 data 方法返回的对象中的元素进行响应式处理时，如果元素是数组时，仅仅对数组本身进行响应式化，而不对数组内部元素进行响应式化。

这也就导致如官方文档所写的后果，无法直接修改数组内部元素来触发响应式。

那么，有没有破解方法呢？

当然有，官方规定了 7 个数组方法，通过这 7 个数组方法，可以很开心地触发数组的响应式，这 7 个数组方法分别是：

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

可以发现，这 7 个数组方法貌似就是原生的那些数组方法，为什么这 7 个数组方法可以触发应式，触发视图更新呢？

你是不是心里想着：数组方法了不起呀，数组方法就可以为所欲为啊？

骚瑞啊，这 7 个数组方法是真的可以为所欲为的。

因为，它们是变异后的数组方法。

## 数组变异思路

什么是变异数组方法？

变异数组方法即保持数组方法原有功能不变的前提下对其进行功能拓展，在 `Vue` 中这个所谓的功能拓展就是添加响应式功能。

将普通的数组变为变异数组的方法分为两步：

1. 功能拓展
2. 数组劫持

## 功能拓展

先来个思考题：

> 有这样一个需求，要求在不改变原有函数功能以及调用方式的情况下，使得每次调用该函数都能在控制台中打印出'HelloWorld'

其实思路很简单，分为三步：

1. 使用新的变量缓存原函数
2. 重新定义原函数
3. 在新定义的函数中调用原函数

看看具体的代码实现：

```js
function A() {
  console.log("调用了函数A");
}

const nativeA = A;
A = function() {
  console.log("HelloWorld");
  nativeA();
};
```

可以看到，通过这种方式，我们就保证了在不改变 A 函数行为的前提下对其进行了功能拓展。

接下来，我们使用这种方法对数组原本方法进行功能拓展：

```js
// 变异方法名称
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];

const arrayProto = Array.prototype;
// 继承原有数组的方法
const arrayMethods = Object.create(arrayProto);

mutationMethods.forEach(method => {
  // 缓存原生数组方法
  const original = arrayProto[method];
  arrayMethods[method] = function(...args) {
    const result = original.apply(this, args);
    console.log("执行响应式功能");
    return result;
  };
});
```

从代码中可以看出来，我们调用 arrayMethods 这个对象中的方法有两种情况：

调用功能拓展方法：直接调用 arrayMethods 中的方法
调用原生方法：这种情况下，通过原型链查找定义在数组原型中的原生方法

通过上述方法，我们实现了对数组原生方法进行功能的拓展，但是，有一个巨大的问题摆在面前：我们该如何让数组实例调用功能拓展后数组方法呢？

解决这一问题的方法就是：数组劫持。

## 数组劫持

数组劫持，顾名思义就是将原本数组实例要继承的方法替换成我们功能拓展后的方法。

想一想，我们在前面实现了一个功能拓展后的数组 arrayMethods ，这个自定义的数组继承自数组对象，我们只需要将其和普通数组实例连接起来，让普通数组继承于它即可。

而想实现上述操作，就是通过原型链。

实现方法如下代码所示：

```js
let arr = []
// 通过隐式原型继承arrayMethods
arr.__proto__ = arrayMethods

// 执行变异后方法
arr.push(1)
```

通过功能拓展和数组劫持，我们终于实现了变异数组，接下来让我们看看 Vue 源码是如何实现变异数组的。

## 源码解析

我们来到 src/core/observer/index.js 中在 Observer 类中的 constructor 函数：

```js
constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    // 检测是否是数组
    if (Array.isArray(value)) {
        // 能力检测
        const augment = hasProto
        ? protoAugment
        : copyAugment
        // 通过能力检测的结果选择不同方式进行数组劫持
        augment(value, arrayMethods, arrayKeys)
        // 对数组的响应式处理
        this.observeArray(value)
    } else {
        this.walk(value)
    }
}
```

`Observer` 这个类是 Vue 响应式系统的核心组成部分，在初始化阶段最主要的功能是将目标对象进行响应式化。在这里，我们主要关注其对数组的处理。

其对数组的处理主要是以下代码

```js
// 能力检测
const augment = hasProto
? protoAugment
: copyAugment
// 通过能力检测的结果选择不同方式进行数组劫持
augment(value, arrayMethods, arrayKeys)
// 对数组的响应式处理，很本文关系不大，略过
this.observeArray(value)
```

首先定义了 augment 常量，这个常量的值由 hasProto 决定。

我们来看看 hasProto：

```js
export const hasProto = '__proto__' in {}
```

可以发现， hasProto 其实就是一个布尔值常量，用来表示浏览器是否支持直接使用 `__proto__` （隐式原型） 。

所以，第一段代码很好理解：根据根据能力检测结果选择不同的数组劫持方法，如果浏览器支持隐式原型，则调用 protoAugment 函数作为数组劫持的方法，反之则使用 copyAugment 。

## 不同的数组劫持方法

现在我们来看看 protoAugment 以及 copyAugment 。

```js
function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}
```

可以看到， protoAugment 函数极其简洁，和在数组变异思路中所说的方法一致：将数组实例直接通过隐式原型与变异数组连接起来，通过这种方式继承变异数组中的方法。

接下来我们再看看 copyAugment ：

```js
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    // Object.defineProperty的封装
    def(target, key, src[key])
  }
}
```

由于在这种情况下，浏览器不支持直接使用隐式原型，所以数组劫持方法要麻烦很多。我们知道该函数接收的第一个参数是数组实例，第二个参数是变异数组，那么第三个参数是什么？

```js
// 获取变异数组中所有自身属性的属性名
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
```

arrayKeys 在该文件的开头就定义了，即变异数组中的所有自身属性的属性名，是一个数组。

回头再看 copyAugment 函数就很清晰了，将所有变异数组中的方法，直接定义在数组实例本身，相当于变相的实现了数组的劫持。

实现了数组劫持后，我们再来看看 Vue 中是怎样实现数组的功能拓展的。

## 功能扩展

数组功能拓展的代码位于 `src/core/observer/array.js` ，代码如下：

```js
import { def } from '../util/index'

// 缓存数组原型
const arrayProto = Array.prototype
// 实现 arrayMethods.__proto__ === Array.prototype
export const arrayMethods = Object.create(arrayProto)

// 需要进行功能拓展的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 缓存原生数组方法
  const original = arrayProto[method]
  // 在变异数组中定义功能拓展方法
  def(arrayMethods, method, function mutator (...args) {
    // 执行并缓存原生数组方法的执行结果
    const result = original.apply(this, args)
    // 响应式处理
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    // 返回原生数组方法的执行结果
    return result
  })
})
```

可以发现，源码在实现的方式上，和我在数组变异思路中采用的方法一致，只不过在其中添加了响应式的处理。

## 总结

Vue 的变异数组从本质上是来说是一种装饰器模式，通过学习它的原理，我们在实际工作中可以轻松处理这类保持原有功能不变的前提下对其进行功能拓展的需求。

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！
