// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),

	action = require('./controllers/action'),
	event = require('./controllers/event'),
	command = require('./controllers/command'),
	os = require('./controllers/os');

// Configure
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(8080);

// Connect to Database
mongoose.connect('mongodb://192.168.1.10/anna',function(err){
	if(err) throw err;
});

// Controllers
action.init(app);
command.init(app);
event.init(app);
event.check();
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});
