var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
//记录所有已经登陆的用户
const users =[]
//启动服务器
server.listen(3000,()=>{
	console.log('服务器启动成功')
})
//把public目录设置为静态资源目录
app.use(require('express').static('public'))
app.get('/',(req,res) =>{
res.sendFile(__dirname+'/index.html')
})










//socket表示用户的连接
io.on("connection",function(socket){
	console.log('新用户加入')
	//socket.emit表示服务器主动给浏览器发数据，
	//参数1是事件的名字(任意)参数2是获取到的数据
	//如果需要给浏览器发消息，需要触发浏览器注册的某个事件
// socket.emit('news',{hello:'word'})
//socket.on表示注册某个事件，如果我想获取浏览器的数据，
//需要注册一个事件，等待浏览器来触发
// socket.on('haha',function(data){
// 	console.log(data)
// 	socket.emit('send',data)
// })
socket.on('login',function(data){
	console.log(data)
	//判断如果data在users在数组里存在，说明该用户已经登陆
	let user = users.find(item =>item.username === data.username)
	if(user){
     socket.emit('loginError',{msg:'用户名已存在，登陆失败'})
	// console.log('登陆失败')
	}else{
      users.push(data)
      socket.emit('loginSuccess',data)
      // console.log('登陆成功')
      //广播
      io.emit('addUser',data)
      //告诉用户聊天室里有多少人
	 io.emit('userList',users)
	 //把登录成功的用户名和头像存储
	 socket.username = data.username
	 socket.avatar = data.avatar
	}
	socket.emit('send',data)

})
//用户断开连接
//监听用户断开连接
socket.on('disconnect',() => {
//把当前用户信息从user里删除，
let idx = users.findIndex(item => item.username === socket.username)
users.splice(idx,1)
//公告离开
io.emit('delUser',{
	 username : socket.username,
	 avatar : socket.avatar
})
//更新列表展示
io.emit('userList',users)
}) 
//监听聊天
socket.on('sendMessage',data => {
console.log(data)
//广播
io.emit('receiveMessage',data)
}) 
})
