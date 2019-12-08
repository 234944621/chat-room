const ws = require('nodejs-websocket')
//导入nodejs-websocket包
const PORT = 3000//定义一个端口
const enter = 0 
const leave = 1 
const msg = 2
let count =0 //有几个用户
//创建一个sever服务,connet表示一个用户的连接
const sever = ws.createServer(connect => {
count++
connect.userName = `用户${count}`
console.log(count)
console.log(connect.userName)
broadcast({
 	type:enter,
 	msg:`${connect.userName}进入了聊天室`,
 	time:new Date().toLocaleTimeString()
 })
//每当接收到用户发的消息,就会触发text事件


connect.on('text',data => {
console.log('接收到用户数据',data)
broadcast(
	{
 	type:msg,
 	msg:data,
 	time:new Date().toLocaleTimeString()
 }
	)
//给用户一个响应的数据
//可以对用户发来的信息做处理
//connect.send(data)只能给一个人发消息
})//网页关闭，就会触发close事件


connect.on('close',data => {
console.log('连接断开')
 count--
 broadcast({
 	type:leave,
 	msg:`${connect.userName}离开了聊天室`,
 	time:new Date().toLocaleTimeString()
 }
 	)
 //发公告说：谁离开了
})//不加error方法就会报错


connect.on('error',()=> {
console.log('错误')
})
})
/*分析消息的处理
1.消息不应该只是字符串，应该是一个对象
2.消息分类 
type:(0)表示用户进入离开时的广播
     (1)表示正常聊天的消息
     msg:消息的内容
     time:聊天的时间*/
function broadcast(msg) {
	// sever.connections:表示所有用户
	//遍历所有item给所有用户发消息
	//msg是一个字符串，上面用函数时
	//传的是一个{}对象，
	sever.connections.forEach(item => {
    item.send(JSON.stringify(msg))
    //用JSON.stringify把msg对象转换为前端字符串
	})
}
//监听端口
sever.listen(PORT,() => {
console.log('启动成功，监听到端口'+PORT)
})