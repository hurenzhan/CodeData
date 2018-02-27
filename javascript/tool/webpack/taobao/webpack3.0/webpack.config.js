const path = require('path');
const uglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const entryServer = require("./src/webpack-config/entry.js");
const copyWebpackPlugin = require("copy-webpack-plugin");

if (process.env.sciskf == "build"){
    var website = {
        "publicPath":"http://www.houxue.com/",
        "version":"1.0.0"
    }
}else {
    var website = {
        "publicPath":"http://192.168.0.101:9000/",
        "version":"1.0.0"
    }
}

if (process.env.sciskf == "build"){
    entry = entryServer.build
}else {
    entry = entryServer.dev
}



module.exports = {
    target:"web",           //or node
    entry:{
        build:'./src/build.js',
        jquery:'jquery',
        vue:'vue'
    },
    output:{                        //出口文件
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js',
        //publicPath:'/temp/'          //共用路径
        publicPath:website.publicPath,
        hotUpdateChunkFilename:'./hot/hot-update.js',
        hotUpdateMainFilename:'./hot/hot-update.json'
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader:'url-loader',
                    options:{
                        limit:5000,             //当图片小于5kb小于base64
                        outputPath:'assets/images/',
                        name:'[hash].[ext]',
                        publicPath:website.publicPath
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }
        ]
    },
    plugins:[
        new webpack.ProvidePlugin({
            $:"jquery",
            "jQuery":"jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
           name:['jquery','vue'],
           filename:"assets/js/[name].js",
           minChunks:2
        }),
        new uglifyjsWebpackPlugin(),
        new htmlWebpackPlugin({
            minify:{
                removeAttributeQuotes:true,         //html压缩
            },
            hash:true,
            template:'./src/index.html',
            title:"hello webpack"
        }),
        new ExtractTextPlugin ("assets/css/index.css"),
        new copyWebpackPlugin([{
            from:__dirname + '/src/public',
            to:'./public'
        }])
    ],
    devServer:{
        contentBase:path.resolve(__dirname,'./dist/'),
        host:'192.168.0.101',
        compress:true,
        port:9000
    },
    watchOptions:{
        poll:1000,
        aggregeateTimeout:500,
        ignored:/node_modules/,
    }
}