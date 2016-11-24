var express = require('express');
var app = express();
var path = require('path')

app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/stylesheets"));
app.use(express.static(__dirname + "/images"));

app.listen(9488);
