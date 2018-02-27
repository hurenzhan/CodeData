const http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

module.exports = app;

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('wulv'));// 密钥
app.use(session( { secret:'node' } ));// 密钥
// configdata 没有暴露出去任何内容 引入所有代码
require('./module/configdata');

app.use('/',require('./router/index'));
app.use('./ueditor/ue',require('./ue'));
http.createServer(app).listen(3000);