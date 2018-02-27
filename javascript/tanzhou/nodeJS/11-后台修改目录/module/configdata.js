const app = require('../app'),
    sql = require('./mysql'),
    navdata = require('./nav');

app.use(function (req,res,next){
    if(req.cookies['login']){
        res.locals.login = req.cookies.login.name;
    }
    if(res.locals.login && req.session.admin === undefined){
        console.log(req.session.admin);
        sql('SELECT * FROM user where username = ?',[res.locals.login],(err,data) => {
            req.session.admin = Number(data[0]['admin']);
            next()
        })
    }else{
        next()
    }
});
app.use(function (req,res,next){
    if(req.session.navdata === undefined){
        navdata(ondata => {
            req.session.navdata = ondata;
            next()
        });
    }else{
        next()
    }
});
