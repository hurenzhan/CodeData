/**
 * Created by wulv on 2017/7/3.
 */

// 1.在js文件互相引用模块  1.js里面 引用2.js
// 2.暂时不用管
// 3.导出(告诉别的文件可以使用我的xxx东西)

define(function (require, exports, module) {
  // js 文件之间互相应用
  // 插件做过处理 在实际引用的时候 相对于当前文件
  var color = require("mokuai1.js");
  console.log(color);
  color(document.querySelector("#box"),"#6cf");

  // 这里是定义模块的地方
  function fn(dom) {
    return document.getElementById(dom)
  }
  // .exports 本身并没有什么意义  意义 : 规范是module.exports
  module.exports = fn
});
