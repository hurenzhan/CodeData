const http = require('http'),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	ws = require('socket.io');
let server = http.createServer(app).listen(3000);
let io = ws(server);
module.exports = {
	app: app,
	io: io
};

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser('wulv')); // 密钥
app.use(session({
	secret: 'node'
})); // 密钥
// configdata 没有暴露出去任何内容 引入所有代码
require('./module/configdata');
let fs = require('fs');
app.post('/fs', (req, res) => {
	/*
	 * 前台  canvas  图片 利用base64转码  =>
	 * node
	 * */
	const imgdata = req.body.data,
		data2 = imgdata.replace(/^data:image\/\w+;base64,/, ""),
		databuffer = Buffer.from(data2, "base64"),
		filename = Date.now();
	fs.writeFile(`./${filename}.png`, databuffer, (err, data) => {
		res.json({
			uptouxiang: filename
		})
	})
});

app.use('/', require('./router/index'));
app.use('./ueditor/ue', require('./ue'));

// io.on() 监听事件的
// connection 当打开有前端的页面  监听websocket连接
let userList = {},
	usernum = 0;
// 回调里的 socket 每个用户都是独立的
io.on('connection', socket => {
	//console.log(socket);
	// io.emit() 发送消息的方法 1.发送的名称 2.内容
	/*io.emit('wulv' ,{ name:'欢迎加入' } );
	 socket.on('xiexie',(data) => {
	 console.log(data);
	 })*/
	//接收前端发送过来的聊天内容
	socket.on('msg', (data) => {
		console.log(data);
		//把内容广播出去
		io.emit('liaotian', data)
	});
	socket.on('login', (data) => {
		userList[data.userid] = data.name;
		socket.name = data.name;
		socket.userid = data.userid;
		usernum++;
		data.num = usernum;
		// 当有用户加入的时候 把加入的用户广播出去
		io.emit('login', {
			data: data,
			userList: userList
		})
	});
	// disconnect 退出触发的事件
	socket.on('disconnect', () => {
		delete userList[socket.userid];
		usernum--;
		//console.log('当前退出的用户是' + socket.name);
		io.emit('out', {
			name: socket.name,
			num: usernum,
			userList: userList
		})
	})
});