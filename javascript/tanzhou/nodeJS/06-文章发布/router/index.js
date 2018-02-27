const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    //console.log(req.query);
    res.locals.admin = req.session.admin;
    //    LIMIT 查询几条到第几条数据
    //  order by id desc 根据id从 新 => 旧进行排序
    sql('SELECT * FROM article order by id desc limit 0,15',(err,data) => {
        console.log(data);
        res.render('index.ejs',{ data:data })
    })
});
router.get('/article/:id.html',(req,res) => {
    // req.params 同时接收get , post , 其它 提交数据的形式
    //console.log(req.params);
    sql('select * from article where id = ?',[req.params.id],(err,data) => {
        if(data.length == 0){
            // status 返回页面的状态码
            res.status(404).render('404');
            return
        }
        res.render('article',{ data:data })
    })
});
router.get('/logout',(req,res) => {
    res.clearCookie('login');// 清除cookie
    res.redirect('/');// 网址重定向
});

router.use('/admin',require('./admin'));
router.use('/reg',require('./reg'));
router.use('/login',require('./login'));
module.exports = router;
