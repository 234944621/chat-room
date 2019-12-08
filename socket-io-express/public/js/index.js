//聊天室的主要功能
//连接socket.io服务,参数是服务器地址
       var socket = io('http://localhost:3000')
       var username,avatar
//2.登陆功能
$('#login_avatar li').on('click',function(){
	$(this).addClass('now')
	.siblings().
	removeClass('now')
})
//点击按钮登陆
$('#login_Btn').on('click',function(){
	//1.获取用户名
	var username = $('#username').val().trim()
	if(!username){
		alert('请输入用户名')
		return
	}

	var password = $('#password').val().trim()
	if(!password){
		alert('请输入密码')
		return
	}
	//获取头像
	var avatar = $('#login_avatar li.now img').attr('src')
	// console.log(username,avatar)
	//提交登陆信息
         socket.emit('login',{
         	username:username,
         	avatar:avatar
         }
       )




var mysql  = require('mysql'); 

 

var connection = mysql.createConnection({    

  host     : 'localhost',      

  user     : 'root',             

  password : 'root',      

  port: '3306',                  

  database: 'node',

});

 

connection.connect();

 

var userGetSql = 'SELECT * FROM user where username= ? and password = ?';
var userGetSql_Params = [username,passwoed];
//查 query

connection.query(userGetSql,userGetSql_Params,function (err, result) {

        if(err){

          console.log('[SELECT ERROR] - ',err.message);

          return;

        }  
        if(result.length>0){
        	socket.on('send',data =>{
        console.log(data)
       })
        }     
});



        //接收服务器返回的数据
       
})
//监听登陆失败请求
 socket.on('loginError',data =>{
       alert('用户名已存在，登陆失败')
       })
//监听登陆成功请求
  socket.on('loginSuccess',data =>{
      // alert('登陆成功')
       //显示聊天窗口
       $('.login').fadeOut()
        $('.container').fadeIn()
        //设置个人信息
        $('.msg_img').attr('src',data.avatar)
        $('.msg_text').text(data.username)
        username=data.username
  avatar=data.avatar
       })

 //监听添加新用户的消息
  socket.on('addUser',data =>{
       //添加一条系统消息
       //模板字符串
       $('.box-bd').append(`
       	<div class="system">
        
          <span class="content">${data.username}加入群组</span>
           	 
         </div>
       	`)
       })
  //监听用户离开的消息
  socket.on('dalUser',data =>{
       //添加一条系统消息
       //模板字符串
       $('.box-bd').append(`
       	<div class="system">
         <p class="message_system">
          <span class="content">${data.username}离开了群组</span>
          </p>       	
         </div>
       	`)
       })

  socket.on('userList',data =>{
  	console.log(data)
       //把userList中的数据动态渲染到左侧菜单
       	$('.online_friend ul').html('')
       data.forEach(item =>{
       	$('.online_friend ul').append(`
           <li>
             <div class="a_friend">
             <div class="head_portrait">                             
          <img src="${item.avatar}" class="list_img">
             </div>
             <div class="friend">
             <div class="name">${item.username}</div>
              </div>
              </div>
           </li>
       		`)
       })
       $('#number').text(data.length)
       })

  //聊天功能
  $('#send_btn').on('click',() =>{
  	//获取到聊天的内容
  	var text = $('#send_txt').val().trim()
  	$('#send_txt').val('')
  	console.log(text)
//   	if(!text)return
 //给服务器发消息
  	socket.emit('sendMessage',{
     msg:text,
     username:username,
     avatar:avatar
  	})
  })

  //监听聊天信息
  socket.on('receiveMessage',data => {
   if(data.username === username){
     //自己的消息
     $('.box-bd').append(`
           <div class="message-box">
                  <div class="my-message">
          <img src="${data.avatar}" class="nr-text-img">
          <div class="content">
            <div class="buttle">
              <div class="buttle_cont">${data.msg}</div>
            </div>
          </div>
         </div>
                  </div>
     	`)
  	}
  	else{
     //别人的消息
     $('.box-bd').append(`
          <div class="message-box">
                  <div class="other-message">
          <img src="${data.avatar}" class="nr-text-img2">
          <div class="content">
            <div class="nickname">
              ${data.username}
            </div>
            <div class="buttle2">
              <div class="buttle2_cont">${data.msg}</div>
            </div>
          </div>
         </div>
     	`)
  	}
     //当前元素的底部要滚动到可视区
  	$('.box-bd').children(':last').get(0).scrollIntoView(false)

  })

