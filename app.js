// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	power = require('./controllers/power'),
	index = require('./controllers/index'),
	activity = require('./controllers/activity'),
	config = require('./config/config.json');


// Configure
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(config.port);


// Controllers
power.init(app);
activity.init(app);
index.init(app);


// Default Controller
app.use(function(req, res){
	res.status(404).end();
});
