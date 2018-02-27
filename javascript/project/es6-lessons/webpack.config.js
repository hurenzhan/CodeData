const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: ['babel-polyfill','./index.js'],
  devServer: {
    contentBase: './dist',
    hot: true,
    compress: true,
    port: 9000,
    clientLogLevel: "none",
    quiet: true
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ],
    rules: [
      {
      	test: /\.css$/, loader: ExtractTextPlugin.extract({
      		fallback: "style-loader",
      		use: ["css-loader"]
      	})
      }
    ]
  },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({template: './app/views/index.ejs'}),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin('index.css')
    ],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
