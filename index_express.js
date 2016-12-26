var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var dbconnect;
var fs = require('fs');
var express= require('express');
var app = express();

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


app.listen(9488);


console.log('Server running at http://140.112.94.163:9488/');

