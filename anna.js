// Dependencies
var app 			= require('express')();

const bodyParser 	= require('body-parser');
const mongoose 		= require('mongoose');

const config 		= require('./config');
const log 			= require('./controllers/log');
const os 			= require('./controllers/os');
const group			= require('./controllers/group');
const scene			= require('./controllers/scene');
const timer			= require('./controllers/timer');
const dio 			= require('./modules/dio');
const hue			= require('./modules/hue');

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
group.init(app);
timer.init(app);
dio.init(app);
hue.init(app);
os.init(app);

// Default Controller
app.use(function (req, res) {
	res.status(404).end();
});