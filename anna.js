// Dependencies
var app 		= require('express')();
var bodyParser 	= require('body-parser');
var sqlite3 	= require('sqlite3');

var config 		= require('./config');
var log 		= require('./app/controllers/log');
var os 			= require('./app/controllers/os');
var dio 		= require('./app/module/dio');
var hue			= require('./app/module/hue');

// Setup
app.use(bodyParser.json());
app.listen(config.port);
app.set('config',config);

var db = new sqlite3.Database(config.database);

// Log
log.init(app);

// API
dio.init(app, db);
hue.init(app);
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end();
});