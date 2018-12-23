var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//路由设置
app.get('/chat', (req,res,next) => res.sendFile(__dirname  +'/chat.html'));

const users = [];

//监听3000端口
http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', socket => {
	let user = '';
	socket.on('username', data => {
		user = data;
		io.local.emit('user conncet', user);
		users.push({name:user});
		io.local.emit('joinUsers', users);
	});
    socket.on('disconnect', () => {
		let u = user;
		const index = users.findIndex(user => user.name === u);
		users.splice(index,1);
		io.local.emit('user disconncet', user);
		io.local.emit('changeUser', users);
    });
	socket.on('sendMsg', data => socket.broadcast.emit('receiveMsg', data));
});