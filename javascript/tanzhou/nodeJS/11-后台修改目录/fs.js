// 文件系统   操作文件
const fs = require('fs');

// 打开文件 , 如果这个文件不存在则创建
// 可以用来检测 文件时候存在
/*fs.open('./3.txt','wx',(err,data) => {
    console.log(data);
});*/
// 创建文件夹
//fs.mkdir('./wulv');
// 删除文件夹
//fs.rmdir('./wulv');
//删除文件
//fs.unlink('./3.txt');
// 读取文件信息
/*
fs.stat('./public',(err,data) => {
    console.log(data);
});*/
// 检测文件  是否可读/写
/*fs.access('./app.js', fs.constants.R_OK | fs.constants.W_OK,(err,data) => {
    console.log(err);
    console.log(data);
});*/
// 把数据追加到 文件里
/*
fs.appendFile('./app.js','新加内容',(err,data) => {

})*/
/*
fs.writeFile('./app.js','这个方法是替换',(err,data) => {

});*/
/*fs.readFile('./app.js',(err,data) => {
    let a;
    a += data;
    console.log(a);
});*/


// 读取文件夹
/*fs.readdir('./views/admin',(err,data) => {
    console.log(data);
});*/

// Sync 同步操作
/*let a = fs.readdirSync('./views/admin');
console.log(a);*/
// 重命名
fs.rename('./app.txt','app.js',() => {

});
