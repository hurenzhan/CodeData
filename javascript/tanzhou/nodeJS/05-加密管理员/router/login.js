const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    crypto = require('crypto');

router.get('/',(req,res) =>{
    //console.log(req.cookies);
    res.render('login')
});
router.post('/',(req,res)=>{
    const user = req.body['name'],
        pass = req.body['pass'],
        md5 = crypto.createHash('md5');
    sql('SELECT * FROM node05 where username = ?',[user],(err,data) => {
        if(data.length == 0){
            res.send('用户名不存在');
            return
        }
        let newpass = md5.update(pass).digest('hex');
        if(data[0]['pass'] == newpass){
            // 登陆成功
            // 1. cookie的名称  2.数据  3.过期时间
            res.cookie('login',{ name:user } ,{ maxAge: 1000*60*60*24 } );
            //  session 所有后台页面都是可以访问到的
            //  保存到服务器上面的
            //  session 在关闭页面的时候 session下面保存的所有数据 会清空
            req.session.admin = Number(data[0]['admin']);
            console.log(req.session.admin);
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
