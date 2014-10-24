// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),

	action = require('./controllers/action'),
	event = require('./controllers/event'),
	command = require('./controllers/command'),
	os = require('./controllers/os'),

	checkIp = require('./services/checkIp'),
	config = require('./config/config.json');


// Configure
app.use(bodyParser.urlencoded({
	extended: true
}));
mongoose.connect('mongodb://localhost/anna',function(err){
	if(err) throw err;
});
app.listen(config.port);

// Controllers
action.init(app);
command.init(app);
event.init(app);
os.init(app);

// Service
checkIp.run(config.ip);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});
