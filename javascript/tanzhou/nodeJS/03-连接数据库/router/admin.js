const express = require('express'),
    router = express.Router();

router.get('/index',(req,res) =>{
    res.send('这里的网址路径是/admin/index')
});

module.exports = router;