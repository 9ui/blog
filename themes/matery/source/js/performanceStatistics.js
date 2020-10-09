(function performanceStatistics() {
    var performance = window.performance;
    if (!performance) {
        // 当前浏览器不支持
        console.log('你的浏览器不支持 performance 接口');
        return;
    }
    var timing = performance.timing;
    // 如果我们需要尽量对页面加载周期的数据进行详细的统计分析：
    console.log('统计模块性能时间：'); // 写出具体模块名称
    console.log('准备新页面时间耗时: ' + (timing.fetchStart - timing.navigationStart) + 'ms');
    console.log('Appcache 耗时: ' + (timing.domainLookupStart - timing.fetchStart) + 'ms');
    console.log('DNS 查询耗时: ' + (timing.domainLookupEnd - timing.domainLookupStart) + 'ms');
    console.log('TCP连接耗时: ' + (timing.connectEnd - timing.connectStart) + 'ms');
    console.log('request请求耗时: ' + (timing.responseEnd - timing.requestStart) + 'ms');
    console.log('请求完毕至DOM加载: ' + (timing.domInteractive - timing.responseEnd) + 'ms');
    console.log('解释dom树耗时: ' + (timing.domComplete - timing.domInteractive) + 'ms');
    console.log('load事件耗时: ' + (timing.loadEventEnd - timing.loadEventStart) + 'ms');
    console.log('从开始至load完成: ' + (timing.loadEventEnd - timing.navigationStart) + 'ms');
    console.log('页面加载耗时: ' + (timing.loadEventStart - timing.navigationStart) + 'ms');
    // 至此，我们可以将页面加载过程中的相关耗时详尽的统计输出，分析耗时较长的地方并作出相关的优化。
})()