// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	action = require('./controllers/action'),
	command = require('./controllers/command'),
	config = require('./config/config.json');


// Configure
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(config.port);


// Controllers
action.init(app);
command.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});
