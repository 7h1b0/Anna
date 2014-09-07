// Dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	power = require('./controllers/power'),
	weather = require('./controllers/weather'),
	alarm = require('./controllers/alarm'),
	index = require('./controllers/index'),
	activity = require('./controllers/activity'),
	config = require('./config/config.json');

// Configure
app.set('view engine', 'jade');
app.use(express.static('./static'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(config.port);


/**
 * CONTROLLER
 */
power.init(app);
activity.init(app);
index.init(app);

// Get Weather
setInterval(function(){
	weather.get(config.city)
}, 1000*60*60*6) // Every 6 hours;

setInterval(function(){
	alarm.check();
},1000*60) // Every 1 minutes


/**
 * DEFAULT
 */
app.use(function(req, res){
	res.status(404).render('404');
});
