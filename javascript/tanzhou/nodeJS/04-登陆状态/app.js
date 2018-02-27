const http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('asdfasdfasdf'));// 密钥
// use get post
app.use(function (req,res,next){
    if(req.cookies['login']){
        res.locals.login = req.cookies.login.name;
    }
    // 继续往下执行
    next()
});

app.use('/',require('./router/index'));
http.createServer(app).listen(3000);
