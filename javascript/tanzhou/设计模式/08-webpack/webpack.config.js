// 引入webpack 在html中script标签引入
// 相当于 goduan = {name: "goudan"}
// 把require直接看作是 module.exports = 的内容
/*

  require("./goudan.js"); 函数执行 传递参数这种方式引入的
  return = {name: "goudan"};



*/

// require引入的时候 直接写名字 是在node_modules目录下找对应的文件
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var extractTextWebpackPlugin = require("extract-text-webpack-plugin");
// webpack是别人写好的一个功能插件
// 把配置好的参数 写在module.exports 供别的文件使用
// 使用webpack命令执行
module.exports = {
  // 入口
  entry: {
    one: "./src/goudan.js",
    t: "./src/wulv.js",
    common: "./src/common.js"
  },
  devtool: "source-map",
  devServer: {
  	port: 8010
  },
  // entry: {}
  // 出口
  output: {
    path: __dirname + "/dist",
    filename: "[name][hash].js"
  },
  module: {
    rules: [
      // 加工接收的文件类型是什么
      // 接收到的文件有很多
      // 匹配到了文件之后用什么方式加工 use:
      // test(加工什么文件) loader(用什么算法加工) options (怎么样进行加工)
      {
      	test: /\.js$/, loader: "babel-loader", options: {
          presets : ["es2015"]
        }
      },
      {
      	test: /\.css$/, loader: extractTextWebpackPlugin.extract({
      		fallback: "style-loader",
      		use: ["css-loader"]
      	})
      }
      // {test: /\.css$/, loader: ""}
    ]
  },
  // 额外的一些功能
  plugins: [
    new webpack.BannerPlugin("版权wulv所有"),
    new HtmlWebpackPlugin({
      // 把打包(加工好的js)自动在html里引用
      filename: 'a.html',
      chunks:['common','t'],
      template: __dirname + "/a.html",
      minify: {// 压缩html文件
        removeComments: true,//移除html里的注释
        collapseWhitespace: true// 删除空白符 换行符
      }
    }),
    new HtmlWebpackPlugin({
      // 把打包(加工好的js)自动在html里引用
      filename: 'b.html',
      chunks:['common','one'],
      template: __dirname + "/b.html",
      minify: {// 压缩html文件
        removeComments: true,//移除html里的注释
        collapseWhitespace: true// 删除空白符 换行符
      }
    }),
    new extractTextWebpackPlugin("[name].css")
  ]
};

// console.log(__dirname + "/dist");
