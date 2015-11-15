// Dependencies
var app 			= require("express")();

const bodyParser 	= require('body-parser');
const mongoose 		= require('mongoose');

const config 		= require('./config');
const logMiddleware = require('./api/middlewares/logMiddlewares');
const requireAuthentification = require('./api/middlewares/authentificationMiddlewares');
const log 			= require('./api/routes/log');
const about 		= require('./api/routes/about');
const scene			= require('./api/routes/scene');
const timer			= require('./api/routes/timer');
const dio 			= require('./api/routes/dio');
const hue				= require('./api/routes/hue');
const user			= require('./api/routes/user');

// Setup Database
const uri = `mongodb://${config.database.hostname}:${config.database.port}/${config.database.name}`;
mongoose.connect(uri);

// Setup Server
app.use(bodyParser.json());
app.listen(config.port);
app.use(logMiddleware);

// API
app.all('/api/*', requireAuthentification)
user(app);
log(app);
scene(app, config);
timer(app, config);
dio(app);
hue(app, config.hue);
about(app, config);

// Default Controller
app.use(function (req, res) {
	res.status(404).end();
});

