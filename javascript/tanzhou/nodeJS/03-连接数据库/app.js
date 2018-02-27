const http = require('http'),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

app.set('views',__dirname+'/views');// 设置模板引擎的目录
app.set('view engine','ejs');// 设置使用的模板引擎是什么
app.use(express.static(__dirname+'/public'));// 设置静态资源目录 js img  css
//app.use('/abc',express.static(__dirname+'/public'));
//  http://localhost:233  /

app.use(bodyParser.json());// 用来接收json的数据
// extended:true 可以接收任何数据类型的数据
app.use(bodyParser.urlencoded( { extended:true } ));

app.use('/',require('./router/index'));
//  http://localhost:233  /admim 这个路径已经被app.use匹配了
//        /index 这个路径是来交给admin.js文件进行匹配的
//app.use('/admin',require('./router/admin'));

http.createServer(app).listen(233);