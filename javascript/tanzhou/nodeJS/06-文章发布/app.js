const http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sql = require('./module/mysql');

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('wulv'));// 密钥
app.use(session( { secret:'node' } ));// 密钥
// use get post进入到函数后就出不去了
app.use(function (req,res,next){
    if(req.cookies['login']){
        res.locals.login = req.cookies.login.name;
    }
    /* 为登陆状态 并且 管理员状态为undefined的时候进行查询
    */
    if(res.locals.login && req.session.admin == undefined){
        sql('SELECT * FROM node05 where username = ?',[res.locals.login],(err,data) => {
            req.session.admin = Number(data[0]['admin']);
            next()
        })
    }else{
        next()
    }
});

app.use('/',require('./router/index'));
http.createServer(app).listen(3000);
