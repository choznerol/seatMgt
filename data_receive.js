var mysql = require('mysql');
var http = require('http');
var dbconnect;
var myurl= require('url');

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

handleError();

http.createServer(function(req, res){
	var str = myurl.parse(req.url, true).query;
	var upload_time;
//	console.log(str.id);
//	console.log(str.status);

	var data = { uid: str.id, status: str.status};

	dbconnect.query('select status from seats where exists (select status from seats where uid=?)', str.id, function(err, res){
//		console.log(res);
		if(err) throw err;
		if(res.length == 0){
//			console.log("insert new users");
			dbconnect.query('INSERT INTO seats SET ?', data, function(err, res){
				if(err) throw err;
				console.log('Last insert ID:', res.insertId);
			});

			dbconnect.query("UPDATE seats SET upload_time=CURRENT_TIMESTAMP() where uid=?", str.id );
		}else{
//			console.log("checking status...");
//			console.log(str.status);
			dbconnect.query("UPDATE seats SET upload_time=CURRENT_TIMESTAMP(), status=? where uid=?", [str.status, str.id] );
		}
	});

//	dbconnect.end();

}).listen(9489);

console.log('server is runnung at port 9489');
