const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    //console.log(req.query);
    res.locals.admin = req.session.admin;
    res.render('index.ejs')
});
router.get('/logout',(req,res) => {
    res.clearCookie('login');
    // 网址重定向
    res.redirect('/')
});

router.use('/admin',require('./admin'));
router.use('/reg',require('./reg'));
router.use('/login',require('./login'));
module.exports = router;
