// Dependencies
var express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, power = require('./controllers/power')
	, activity = require('./controllers/activity')
	, config = require('./config/config.json');

// Configure
app.set('view engine', 'jade');
app.use(express.static('./static'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(config.port);


// Controller
power.init(app);
activity.init(app);

// Default
app.use(function(req, res){
	res.status(404).render('404');
});
