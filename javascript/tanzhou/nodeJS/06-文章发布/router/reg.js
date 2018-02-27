const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    crypto = require('crypto');

router.get('/',(req,res) =>{
    res.render('reg')
});
router.post('/',(req,res) => {
    const user = req.body.user,
        pass = req.body.pass,
        md5 = crypto.createHash('md5');
    // where 查询条件
    sql('SELECT * FROM node05 where username = ?',[user],(err,data) => {
        // console.log(data.length);
        if(data.length === 0){// 可以注册
            //console.log('可以注册');
                        //  加密 密码       编码格式hex
            let newpass = md5.update(pass).digest('hex');
            sql('INSERT INTO node05 (id,username,pass,admin) VALUES (0,?,?,false)',[user,newpass],(err,data) => {
                if(err){
                    res.render('err.ejs');
                    return
                }
                res.locals.result = '<h1>成功</h1><a style="margin:10px;" href="/">首页</a><a href="/login">前往登陆</a>';
                res.render('reg')
            })
        }else{// 不可以注册
            //console.log('不可以注册');
            res.render('err.ejs');
        }
    })

});

module.exports = router;
