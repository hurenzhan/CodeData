const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    upload = require('../module/multer');

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
    sql('SELECT * FROM user',(err,data) => {
        res.render('admin/user',{data:data})
    });
});
router.post('/user',(req,res) => {
    let id = req.body.id;
    sql('DELETE FROM user WHERE id = ?',[id],(err,data) =>{
        res.render('admin/user')
    });
});
router.get('/user/updateuser',(req,res) => {
    sql('SELECT * FROM user where id = ?',[req.query.id],(err,data) => {
        res.render('admin/updateuser',{data:data})
    });
});
router.post('/user/updateuser',(req,res) => {
    const name = req.body.name,
        id = req.body.id,
        admin = req.body.admin;
    sql('update user set username = ?,admin = ? where id = ?',[name,admin,id],(err,data) => {
        if(err){
            res.send('更新失败');
            return
        }
        res.json({
            result:'成功'
        })
    })
});
router.get('/article',(req,res) => {
    res.render('admin/article')
});
//                     upload.single 用来接收1个文件
router.post('/article',upload.fields([{ name: 'wulv1', maxCount: 4 }, { name: 'wulv2', maxCount: 8 }]),(req,res) => {
    console.log(req.body);
    console.log(req.upload); // 限制上传 {}
    /*let title = req.body.title,
        tag = req.body.tag,
        author = req.body.author,
        content = req.body.content,
        img = '/img/' + req.file.filename,
        time = new Date().toLocaleString().substring(0,10);
    sql('INSERT INTO article (id,title,tag,author,content,time,img) VALUES (0,?,?,?,?,?,?)',
    [title,tag,author,content,time,img],(err,data) => {
        if(err){
            res.send('保存失败');
            return
        }
        res.json({
            result:'保存成功'
        })
    });*/
});
router.get('/nav',(req,res) => {
    sql('SELECT * FROM nav where leve = 1',(err,data) => {
        res.render('admin/nav',{data:data})
    })
});
router.post('/nav',(req,res) => {
    console.log(req.body);
    /*sql('INSERT INTO nav (id, title, navid,leve,url) VALUES (1,?,?,1,?)',[],(err,data) => {

    });
    res.render('nav')*/
});

module.exports = router;
