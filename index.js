var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var dbconnect;
var fs = require('fs');
var express= require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var connections = [],
	events = [];

app.use(express.static(__dirname + "/home/"));
app.use(express.static(__dirname + "/home/stylesheets"));
app.use(express.static(__dirname + "/home/images"));

function handleError(){
	dbconnect = mysql.createConnection({
		host: 'localhost',
		user: 'pi',
		password: 'test',
		database: 'seatdb',
		port: 3306
	});

	dbconnect.connect(function (err){
		if(err){
			console.log('error when connecting to db', err);
			setTimeout(handleError, 2000);
		}
	});

	dbconnect.on('error', function(err){
		console.log('db error', err);
		if(err.code === 'PROTOCOL_CONECTION_LOST'){
			handleError();
		}else{
			throw err;
		}
	});
}
handleError();

var pollingLoop = function() {
	var query = dbconnect.query('SELECT uid, status, TIMESTAMPDIFF(SECOND,upload_time,NOW())  AS time FROM seats');

	query
		.on('error', function(err) {
			console.log(err);
			updateSockets(err);
		})
		.on('result', function(event) {

			if(events.indexOf(event)===-1){
				console.log(event);
				events = [];
				events.push(event);
			}

			//if(events.indexOf(event)===-1){
			//	events.push(event);
			//	console.log(event);
			//}
		});
	console.log("db: ", events.length, "events");
}

pollingLoop();

server.listen(9488);
console.log('Server running at http://140.112.94.163:9488/');

var serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	pollingLoop();
	setInterval(function() {
		
		pollingLoop();
		socket.emit('message', events);
		process.stdout.write('.');
	},1000);

	// Disconnect
	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
});

serv_io.sockets.on('refresh', function(){
	console.log("refresh request");
	for (var i=0; i<events.length; i++) {
		console.log(events[i].id);
	}
});

var updateSockets = function(data) {
	data.time = new Date();
	console.log('Pushing new data to the clients connected ( connections amount = %s ) - %s', connections.length , data.time);
	connections.forEach(function(tmpSocket){
		tmpSocket.volatile.emit('notification', data);
	});
};



