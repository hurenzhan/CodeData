/**
 * 多页面支持
 */

var path = require('path')
var fs = require("fs")
var HtmlWebpackPlugin = require('html-webpack-plugin')
var entries = require('../src/index')
var config = require('../config')

var moduleRootPath = 'src/' //模块根目录(这个可以根据自己的需求命名)

/**
 * 获取js入口数组
 */
exports.getEntries = function getEntries(){
  //缓存js入口数组
  var entry = {}
  //初始化模块列表
  //变量模块列表
  entries.forEach(function (module) {
    if (module.path && module.name){
      entry[module.name] = path.resolve(moduleRootPath + module.path + '/index.js')
    }
  })
  return entry
}

/**
 * 获取dev的Html模板集合
 * @returns {dev的Html模板集合}
 */
exports.getDevHtmlWebpackPluginList = function getDevHtmlWebpackPluginList(){
  //缓存dev的Html模板集合
  var devHtmlWebpackPluginList = []
  //遍历生成模块的HTML模板
  entries.forEach(function (mod) {
    //生成配置
    var conf = {
      filename: mod.name + ".html",
      template: moduleRootPath + mod.path + '/index.html',
      chunks: [mod.name],
      inject: true
    }
    //添加HtmlWebpackPlugin对象
    devHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf))
  })
  return devHtmlWebpackPluginList
}

/**
 * 获取prod的Html模板集合
 * @returns {prod的Html模板集合}
 */
exports.getProdHtmlWebpackPluginList = function getProdHtmlWebpackPluginList(){
  //缓存dev的Html模板集合
  var prodHtmlWebpackPluginList = []
  //遍历生成模块的HTML模板
  entries.forEach(function (mod) {
    //生成配置
    var conf = {
      filename: mod.name+"." + config.build.type,
      template: moduleRootPath + mod.path + '/index.html',
      inject: true,
      showErrors: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      chunks: ['manifest','vendor', mod.name]
    }
    //添加HtmlWebpackPlugin对象
    prodHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf))
  })
  return prodHtmlWebpackPluginList
}
