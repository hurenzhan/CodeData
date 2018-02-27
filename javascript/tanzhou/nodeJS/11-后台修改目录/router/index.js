const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    res.locals.admin = req.session.admin;
    sql('SELECT * FROM article order by id desc limit 0,2',(err,data) => {
        res.render('index.ejs',{ articleListdata:data })
    })
});
router.get('/nav',(req,res) => {
    console.log('nav');
    res.render('nav',{ navdata: req.session.navdata})
});
router.get('/article/list-:page.html',(req,res) => {
    //console.log(req.params);
    //   limit 0,2  0代表从第几个开始查询   2 查询几条
    //  1   0 2
    //  2   2 2
    //  3   4d
    sql('select * from article order by id desc limit ?,2',
        [(req.params.page-1)*2],(err,data) => {
            if(data.length === 0){
                res.send(err)
            }
            sql('SELECT * FROM article',(err,alldata) => {
                res.render('article_list',{articleListdata:data , alldata:alldata.length})
            })
        })
});
router.get('/article/:id.html',(req,res) => {
    // req.params 同时接收get , post , 其它 提交数据的形式
    //console.log(req.params);
    sql('select * from article where id = ?',[req.params.id],(err,data) => {
        //console.log(Number(data[0]['read'])+1);
        //res.cookie("wenzhang", {read:true} , {maxAge:1000*60*60*24});
        if(data.length === 0){
            // status 返回页面的状态码
            res.status(404).render('404');
            return
        }
        sql('select * from articlepinglun where pid = ?',[req.params.id],(err,data1) => {
            res.render('article',{ data:data , pinglun:data1 })
        })
    })
});
router.post('/article/:id.html',(req,res) => {
    console.log(req.params);
    console.log(req.body);
    sql('INSERT INTO articlepinglun (id,uid,pid,content) VALUES (1,0,?,?)',
        [req.params.id , req.body.content])
    res.send('成功')
});
router.get('/logout',(req,res) => {
    res.clearCookie('login');// 清除cookie
    res.redirect('/');// 网址重定向
});
router.get('/search',(req,res) => {
    console.log(req.query.search);
    sql(`SELECT * FROM article WHERE title LIKE ? `,['%'+ req.query.search+'%'],(err,data) => {
        console.log(err);
        res.send(data)
    })
});

router.use('/admin',require('./admin'));
router.use('/reg',require('./reg'));
router.use('/login',require('./login'));
module.exports = router;
