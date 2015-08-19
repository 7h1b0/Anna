// Dependencies
var app 		= require('express')();
var bodyParser 	= require('body-parser');
var sqlite3 	= require('sqlite3');

var config 		= require('./config');
var log 		= require('./app/controllers/log');
var user 		= require('./app/controllers/user')
var device 		= require('./app/controllers/device');
var schedule 	= require('./app/controllers/schedule');
var os 			= require('./app/controllers/os');

// Use bcrypt to hash password;


// Setup
app.use(bodyParser.json());
app.listen(config.port);
app.set('config',config);

var db = new sqlite3.Database(config.database);

// Log
log.init(app);

// API
user.init(app,db);
schedule.init(app);
device.init(app,db);
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end();
});