var ws = require('nodejs-websocket')

var server = ws.createServer(function (conn){
	console.log('New Connection!')
	conn.on("text", function(str){
		console.log('Received ' + str)
		conn.sendText(str.toUpperCase()+"!!!")
	})
	conn.on("close", function(code, reason){
		console.log('Connection is closed')
	})
}).listen(8080)
