const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    // res.render 用来响应模板引擎文件的
    //  'index' 是代表响应的是 index.ejs模板引擎
    /*let obj = {
        name:'wulv',
        kecheng:'node',
        yuefen:'3月'
    };*/
    sql('SELECT * FROM `node`',(err,data) => {
        res.render('index.ejs', { data : data  } )
    });
});
router.get('/qingrenjie',(req,res) => {
    res.render('post.ejs')
});
router.get('/reg',(req,res) =>{
    // get方式提交的内容
    // ? 动态数据   1.数据库代码 2.动态的值[  ]
    sql('INSERT INTO `node` (`name`,`psw`) VALUES (?,?)',[req.query.name ,req.query.psw],(err,data) => {
        res.json({
            chenggong:"成功"
        })
    });
});
router.post('/reg',(req,res) => {
    //req.body 用来接收post方式提交的数据
    sql('INSERT INTO `node` (`name`,`psw`) VALUES (?,?)',[req.body.name ,req.body.psw],(err,data) => {
//      res.json({
//          chenggong:"data"
//      })
		sql(`SELECT * FROM node WHERE name = '${req.body.name}'`,(err,data) => {
	        res.json(data)
	    });
    });
});
router.post('/del',(req,res) => {
    //req.body 用来接收post方式提交的数据
    //delete from users where name = 'Mike'
	sql(`SELECT * FROM node WHERE name = '${req.body.name}'`,(err,data) => {
		if(data.length !== 0){
			let Data = data
		    sql(`DELETE FROM node WHERE name = '${req.body.name}'`,(err,data) => {
		      	res.json({
		      		name:'用户名:'+Data[0].name,
		      		psw:'密码:'+Data[0].psw
		      	})
		    });
		}
    });
});
router.post('/gai',(req,res) => {
    //req.body 用来接收post方式提交的数据
    //delete from users where name = 'Mike'
//  console.log(req.body);
    sql('UPDATE node SET psw = ? WHERE name = ?',[req.body.newPsw,req.body.name],(err,data) => {
    	console.log(err);
        res.json({
            chenggong:"修改成功";
        })
    });
});

module.exports = router;