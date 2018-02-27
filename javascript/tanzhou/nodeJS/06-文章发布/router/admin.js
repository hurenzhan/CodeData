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
    let id = req.body.id;
    sql('DELETE FROM node05 WHERE id = ?',[id],(err,data) =>{
        sql('SELECT * FROM node05',(err,data) => {
            res.render('admin/user',{data:data});
        });
    });
});
router.get('/user/updateuser',(req,res) => {
    sql('SELECT * FROM node05 where id = ?',[req.query.id],(err,data) => {
        res.render('admin/updateuser',{data:data})
    });
});
router.post('/user/updateuser',(req,res) => {
    const name = req.body.name,
        id = req.body.id,
        admin = req.body.admin;
    sql('update node05 set username = ?,admin = ? where id = ?',[name,admin,id],(err,data) => {
        if(err){
            res.send('更新失败');
        }
        res.json({
            result:'成功'
        })
    })
});
router.get('/article',(req,res) => {
    res.render('admin/article')
});
router.post('/article',(req,res) => {
    let title = req.body.title,
        tag = req.body.tag,
        author = req.body.author,
        content = req.body.content,
        time = new Date().toLocaleString().substring(0,10);
    sql('INSERT INTO article (id,title,tag,author,content,time) VALUES (0,?,?,?,?,?)',
    [title,tag,author,content,time],(err,data) => {
        if(err){
            res.send('保存失败');
            return
        }
        res.json({
            result:data['insertId']
        })
    })
});

module.exports = router;
