const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    console.log(req.cookies);
    res.render('reg')
});
router.post('/',(req,res)=>{
    const user = req.body['name'],
        pass = req.body['pass'];
    sql('SELECT * FROM node04 where username = ?',[user],(err,data) => {
        console.log(data);
        if(data.length == 0){
            res.send('用户名不存在');
            return
        }
        if(data[0]['admin'] == 0){

        }
        if(data[0]['pass'] == pass){
            // 登陆成功
            // 1. cookie的名称  2.数据  3.过期时间
            res.cookie('login',{ name:user } ,{ maxAge: 1000*60*60*24 } );
            res.json({
                result:'成功'
            });
        }else{
            // 登陆失败
            res.send('错误')
        }
    })
});


module.exports = router;