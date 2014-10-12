// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),
	action = require('./controllers/action'),
	event = require('./controllers/event'),
	checkIp = require('./controllers/checkIp'),
	command = require('./controllers/command'),
	os = require('./controllers/os'),
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
os.init(app);
checkIp.run(config.ip);

// API RESFul
command.init(app);
event.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});
