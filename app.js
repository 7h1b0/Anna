// Dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	power = require('./controllers/power'),
	weather = require('./controllers/weather'),
	smartphone = require('./controllers/smartphone'),
	alarm = require('./controllers/alarm'),
	index = require('./controllers/index'),
	activity = require('./controllers/activity'),
	config = require('./config/config.json');


// Configure
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(config.port);


// Controllers
power.init(app);
activity.init(app);
index.init(app);
smartphone.check();
weather.get();
//alarm.check();


// Default Controller
app.use(function(req, res){
	res.status(404).end();
});
