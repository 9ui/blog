---
title: 防抖与节流
date: 2019-05-14 13:35:16
tags:
  - 工具类
  - 性能
author: 左智文
img: https://img.90c.vip/js-cover/1705248_a6d3.jpg?x-oss-process=image/format,webp
summary: 防抖和节流是针对响应跟不上触发频率这类问题的两种解决方案。
categories: 工具类
---

#### 前言

防抖和节流是针对响应跟不上触发频率这类问题的两种解决方案。 在给 DOM 绑定事件时，有些事件我们是无法控制触发频率的。 如鼠标移动事件 onmousemove, 滚动滚动条事件 onscroll，窗口大小改变事件 onresize，瞬间的操作都会导致这些事件会被高频触发。 如果事件的回调函数较为复杂，就会导致响应跟不上触发，出现页面卡顿，假死现象。 在实时检查输入时，如果我们绑定 onkeyup 事件发请求去服务端检查，用户输入过程中，事件的触发频率也会很高，会导致大量的请求发出，响应速度会大大跟不上触发。

针对此类快速连续触发和不可控的高频触发问题，`debounce` 和 `throttling` 给出了两种解决策略；

debounce，去抖动。策略是当事件被触发时，设定一个周期延迟执行动作，若期间又被触发，则重新设定周期，直到周期结束，执行动作。 这是 debounce 的基本思想，在后期又扩展了前缘 debounce，即执行动作在前，然后设定周期，周期内有事件被触发，不执行动作，且周期重新设定。

#### 函数防抖(debounce)

>1. 鼠标/触摸屏的 mouseover/touchmove 事件
>2. 页面窗口的 resize 事件
>3. 滚动条的 scroll 事件

当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。如下图，持续触发 scroll 事件时，并不执行 handle 函数，当 1000 毫秒内没有触发 scroll 事件时，才会延时触发 scroll 事件。

![图1](https://img.90c.vip/code/img006.jpg?x-oss-process=image/format,webp)

防抖debounce代码：

```js
// 防抖
function debounce(fn, wait) {
  var timeout = null;
  return function() {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  };
}
// 处理函数
function handle() {
  console.log(Math.random());
}
// 滚动事件
window.addEventListener("scroll", debounce(handle, 1000));
```

当持续触发scroll事件时，事件处理函数handle只在停止滚动1000毫秒之后才会调用一次，也就是说在持续触发scroll事件的过程中，事件处理函数handle一直没有执行。

浏览器的 `resize`、`scroll`、`keypress`、`mousemove` 等事件在触发时，会不断地调用绑定在事件上的回调函数，极大地浪费资源，降低前端性能。为了优化体验，需要对这类事件进行调用次数的限制。

#### 函数节流(throttle)

>1. API 的调用
>2. 按钮点击事件/input 事件，防止用户多次重复提交

当持续触发事件时，保证一定时间段内只调用一次事件处理函数。节流通俗解释就比如我们水龙头放水，阀门一打开，水哗哗的往下流，秉着勤俭节约的优良传统美德，我们要把水龙头关小点，最好是如我们心意按照一定规律在某个时间间隔内一滴一滴的往下滴。如下图，持续触发 scroll 事件时，并不立即执行 handle 函数，每隔 1000 毫秒才会执行一次 handle 函数

![图2](https://img.90c.vip/code/img005.jpg?x-oss-process=image/format,webp)

节流 throttle 代码（时间戳）：

```js
var throttle = function(func, delay) {
  var prev = Date.now();
  return function() {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
};
function handle() {
  console.log(Math.random());
}
window.addEventListener("scroll", throttle(handle, 1000));
```

当高频事件触发时，第一次会立即执行（给scroll事件绑定函数与真正触发事件的间隔一般大于delay，如果你非要在网页加载1000毫秒以内就去滚动网页的话，我也没办法o(╥﹏╥)o），而后再怎么频繁地触发事件，也都是每delay时间才执行一次。而当最后一次事件触发完毕后，事件也不会再被执行了 （最后一次触发事件与倒数第二次触发事件的间隔小于delay，为什么小于呢？因为大于就不叫高频了呀(*╹▽╹*)）。

节流 throttle 代码（定时器）：

```js
// 节流throttle代码（定时器）：
var throttle = function(func, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
};
function handle() {
  console.log(Math.random());
}
window.addEventListener("scroll", throttle(handle, 1000));
```

当触发事件的时候，我们设置一个定时器，再次触发事件的时候，如果定时器存在，就不执行，直到delay时间后，定时器执行执行函数，并且清空定时器，这样就可以设置下个定时器。当第一次触发事件时，不会立即执行函数，而是在delay秒后才执行。而后再怎么频繁触发事件，也都是每delay时间才执行一次。当最后一次停止触发后，由于定时器的delay延迟，可能还会执行一次函数。

节流中用时间戳或定时器都是可以的。更精确地，可以用时间戳+定时器，当第一次触发事件时马上执行事件处理函数，最后一次触发事件后也还会执行一次事件处理函数。

节流throttle代码（时间戳+定时器）：

```js
// 节流throttle代码（时间戳+定时器）：
var throttle = function(func, delay) {
  var timer = null;
  var startTime = Date.now();
  return function() {
    var curTime = Date.now();
    var remaining = delay - (curTime - startTime);
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(func, remaining);
    }
  };
};
function handle() {
  console.log(Math.random());
}
window.addEventListener("scroll", throttle(handle, 1000));
```

在节流函数内部使用开始时间startTime、当前时间curTime与delay来计算剩余时间remaining，当remaining<=0时表示该执行事件处理函数了（保证了第一次触发事件就能立即执行事件处理函数和每隔delay时间执行一次事件处理函数）。如果还没到时间的话就设定在remaining时间后再触发 （保证了最后一次触发事件后还能再执行一次事件处理函数）。当然在remaining这段时间中如果又一次触发事件，那么会取消当前的计时器，并重新计算一个remaining来判断当前状态。

#### 完整代码(debounce-throttle.js)

```js
const _ = {};

// 参数处理
var restArgs = function(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
};

// 事件
_.now =
  Date.now ||
  function() {
    return new Date().getTime();
  };

// 延迟执行
_.delay = restArgs(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
});

// 防抖
_.debounce = function(func, wait, immediate) {
  var timeout, result;

  var later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArgs(function(args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = _.delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

// 节流
_.throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

module.exports = _;
```

#### 工具类的使用

```text
1. 引入工具类 例如 import utils from 'debounce-throttle.js'
2. 使用工具类的方法
 防抖函数的使用:  window.addEventListener('resize',utils.debounce(()=>{console.log(1)},1000))
 节流函数的使用:  utils.throttle(() => {调用某接口}, 1666)
```

#### 总结

`函数防抖`：将几次操作合并为一此操作进行。原理是维护一个计时器，规定在 delay 时间后触发函数，但是在 delay 时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。

`函数节流`：使得一定时间内只触发一次函数。原理是通过判断是否到达一定时间来触发函数。

区别： 函数节流不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而函数防抖只是在最后一次事件后才触发一次函数。 比如在页面的无限加载场景下，我们需要用户在滚动页面时，每隔一段时间发一次 Ajax 请求，而不是在用户停下滚动页面操作时才去请求数据。这样的场景，就适合用节流技术来实现。

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！