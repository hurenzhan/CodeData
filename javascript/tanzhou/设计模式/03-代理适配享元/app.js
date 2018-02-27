//相当于script标签引入进来赋值给变量
var express = require("express");
// 初始化
var app = express();
// get方式访问这个！！网址！！路径的时候 ， 执行对应的函数
app.get("/wulv", function (req, res) {
    // 参数1 req 浏览器发送给服务器所有的东西保存在第一个参数里
    // res 服务器向浏览器发送数据内容方法
    // res.send("Hello Word!");
    var callback = req.query.callback;
    var data = {name: "wulv", age: 18};
    console.log(JSON.stringify(data))
    res.send( callback + "(" + JSON.stringify(data) + ")" );
});

app.listen(666);
