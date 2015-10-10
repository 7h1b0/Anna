// Dependencies
var app 		= require('express')();
var bodyParser 	= require('body-parser');
var mongoose 	= require('mongoose');

var config 		= require('./config');
var log 		= require('./app/controllers/log');
var os 			= require('./app/controllers/os');
var group		= require('./app/controllers/group');
var scene		= require('./app/controllers/scene');
var timer		= require('./app/controllers/timer');
var dio 		= require('./app/module/dio');
var hue			= require('./app/module/hue');

// Setup
app.use(bodyParser.json());
app.listen(config.port);
app.set('config',config);
var uri = 'mongodb://' + config.hostname_db + "/" + config.database;
console.log(uri);
mongoose.connect(uri);

// Log
log.init(app);

// API
dio.init(app);
hue.init(app);
os.init(app);
group.init(app);
scene.init(app);
timer.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end();
});