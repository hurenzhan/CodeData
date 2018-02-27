// 3 多线程接收发过的数据 并计算完
self.onmessage = function (e) {
    // ....经过大量的计算
    console.log( e.data );
    // 4 把运算完的结果 发送到前端网页
    self.postMessage( encodeURI(e.data) );
}