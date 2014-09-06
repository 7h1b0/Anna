// Dependencies
var express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, power = require('./controllers/power')
	, weather = require('./controllers/weather')
	, next = require('./controllers/next')
	, activity = require('./controllers/activity')
	, config = require('./config/config.json');

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
next.init(app);

//setInterval(function(){
	weather.get(config.city)
//}, 1000*60*2) // Every 6 hours;


/**
 * DEFAULT
 */
app.use(function(req, res){
	res.status(404).render('404');
});
