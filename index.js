var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var dbconnect;
var fs = require('fs');
var express= require('express');
var app = express();

app.use('/img',express.static(path.join(__dirname, 'home/images')))
app.use('/js',express.static(path.join(__dirname, 'home/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'home/stylesheets')));

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


http.createServer(function (request, response) {
	var fileName = path.basename(request.url);
	var localFolder = __dirname + '/home/';
	filePath = localFolder + fileName;
	var extname = String(path.extname(filePath)).toLowerCase();

	console.log('request ', request.url);
	
//	    var filePath = '.' + request.url;
	    if (filePath == './')
		        filePath = './index.html';
	
//	    var extname = String(path.extname(filePath)).toLowerCase();
	    var contentType = 'text/html';
	    var mimeTypes = {
		            '.html': 'text/html',
		            '.js': 'text/javascript',
		            '.css': 'text/css',
		            '.json': 'application/json',
		            '.png': 'image/png',
		            '.jpg': 'image/jpg',
		            '.gif': 'image/gif',
		            '.wav': 'audio/wav',
		            '.mp4': 'video/mp4',
		            '.woff': 'application/font-woff',
		            '.ttf': 'application/font-ttf',
		            '.eot': 'application/vnd.ms-fontobject',
		            '.otf': 'application/font-otf',
		            '.svg': 'application/image/svg+xml'
		        };
	
	    contentType = mimeTypes[extname] || 'application/octect-stream';

	
	console.log('contentType: ', contentType);


	    fs.readFile(filePath, function(error, content) {
		            if (error) {
				                if(error.code == 'ENOENT'){
							                fs.readFile('./404.html', function(error, content) {
										                    response.writeHead(200, { 'Content-Type': contentType });
										                    response.end(content);
										                });
							            }
				                else {
							                response.writeHead(500);
							                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
							                response.end();
							            }
				            }
		            else {
				                response.writeHead(200, { 'Content-Type': contentType });
				                response.end(content, 'utf-8');
				            }
		        });
	
}).listen(9488);
console.log('Server running at http://140.112.94.163:9488/index.html/');
