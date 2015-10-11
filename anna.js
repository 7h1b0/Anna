// Dependencies
var app 		= require('express')();
var bodyParser 	= require('body-parser');
var mongoose 	= require('mongoose');

var config 		= require('./config');
var log 		= require('./controllers/log');
var os 			= require('./controllers/os');
var group		= require('./controllers/group');
var scene		= require('./controllers/scene');
var timer		= require('./controllers/timer');
var dio 		= require('./modules/dio');
var hue			= require('./modules/hue');

// Setup
app.use(bodyParser.json());
app.listen(config.port);
app.set('config',config);

// Setup Database
var uri = 'mongodb://' + config.hostname_db + "/" + config.database;
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