// Dependencies
var app 			= require('express')();

const bodyParser 	= require('body-parser');
const mongoose 		= require('mongoose');

const config 		= require('./config');
const log 			= require('./api/routes/log');
const about 		= require('./api/routes/about');
const scene			= require('./api/routes/scene');
const timer			= require('./api/routes/timer');
const dio 			= require('./api/routes/dio');
const hue				= require('./api/routes/hue');

// Setup
app.use(bodyParser.json());
app.listen(config.port);
app.set('config',config);

// Setup Database
const uri = `mongodb://${config.database.hostname}:${config.database.port}/${config.database.name}`;
mongoose.connect(uri);

// Log
log.init(app);

// API
scene.init(app);
timer.init(app);
dio.init(app);
hue.init(app);
about.init(app);

// Default Controller
app.use(function (req, res) {
	res.status(404).end();
});