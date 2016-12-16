var express = require('express');
var app = express();
var path = require('path')
var mysql = require('mysql');
var dbconnect;

app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/stylesheets"));
app.use(express.static(__dirname + "/images"));

function handleError(){
	dbconnect=mysql.createConnection({
		host: 'localhost',
		user: 'pi',
		password: 'test',
		database: 'seatdb',
		port:3306
	});

	dbconnect.connect(function (err){
		if(err){
			console.log('error when connecting to db:', err);
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

/*function query(){
	dbconnect.query('SELECT * FROM `seats`', function(err, rows, fields){
		if(err) throw err;
		for(var r in rows){
			console.log('the id is : ', rows[r].id);
		}
	});
}
*/

handleError();
//query();

//dbconnect.end();

app.listen(9488);
