self.onmessage = function (e) {
    var str = '';
    var n = e.data;
    for ( var i=0;i<n;i++ ){
        str += String.fromCharCode(i); // 把 0~ 10000的ASICC码转换成对应字符
    }
    self.postMessage(str);
}