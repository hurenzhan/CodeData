/**
 * Created by wulv on 2017/7/3.
 */


function wulv5(url, cb) {
  // 创建标签
  var hm = document.createElement("script");
  // 让script标签的路径 = 穿进来的参数
  hm.src = url;
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);

  var require,
    exports,
    module = {};
  window.define = function (fn) {
    // fn = 以下代码
    /*
    function (require, exports, module) {
      // 这里是定义模块的地方
      function fn(dom) {
        return document.getElementById(dom)
      }
      module.exports = fn
    }
    */
    fn(require, exports, module);
    // console.log(module);

//     cb =
//     function (goudan) {
//       console.log(goudan);
//       console.log(goudan("box"));
//     }
    cb(module.exports);
    s.parentNode.removeChild(hm)
  }
}
