const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    res.render('login')
});
router.post('/',(req,res) => {
    const user = req.body.user,
        pass = req.body.pass;
    // where 查询条件
    sql('SELECT * FROM node04 where username = ?',[user],(err,data) => {
        // console.log(data.length);
        if(data.length === 0){// 可以注册
            //console.log('可以注册');
            sql('INSERT INTO node04 (id,username,pass) VALUES (0,?,?)',[user,pass],(err,data) => {
                if(err){
                    res.render('err.ejs');
                    return
                }
                res.locals.result = '<h1>成功</h1>';
                res.render('login')
            })
        }else{// 不可以注册
            //console.log('不可以注册');
            res.render('err.ejs');
        }
    })

});

module.exports = router;
