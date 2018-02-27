const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');
//sql(`INSERT INTO user (id, username, pass) VALUES ('1', '十大发生地方', '123');`);
router.get('/',(req,res) =>{
    res.render('index.ejs')
});
router.get('/logout',(req,res) => {
    res.clearCookie('login');
    // 网址重定向
    res.redirect('/')
});
// 用login代表的注册  用reg代表的登陆
router.use('/login',require('./login'));
// http://localhost:3000/reg /
// 用login代表的注册  用reg代表的登陆
router.use('/reg',require('./reg'));
module.exports = router;