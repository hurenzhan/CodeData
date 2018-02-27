const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');
// get post 任何形式的访问都会走这一条路由
router.use((req,res,next) => {
    if(req.session.admin){
        next()
    }else{
        res.send('请用管理员账号登陆')
    }
});
router.get('/',(req,res) =>{
    res.render('admin/admin');
});
router.get('/user',(req,res) => {
    sql('SELECT * FROM node05',(err,data) => {
        res.render('admin/user',{data:data})
    });
});
router.post('/user',(req,res) => {
    //console.log(req.body);
    let id = req.body.id;
        sql('DELETE FROM node05 WHERE id = ?',[id],(err,data) =>{
        });
    /*res.json({
        aaa:'bbb'
    })*/
});
router.get('/user/updateuser',(req,res) => {
    //console.log(req.query);
    sql('SELECT * FROM node05 where id = ?',[req.query.id],(err,data) => {
        res.render('admin/updateuser',{data:data})
    });
});

module.exports = router;
