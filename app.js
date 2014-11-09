// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),
	//GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,

	action = require('./controllers/action'),
	event = require('./controllers/event'),
	command = require('./controllers/command'),
	os = require('./controllers/os'),

	config = require('./config/config.json');


// Configure
app.use(bodyParser.urlencoded({
	extended: true
}));
app.listen(config.port);


// API Key
/*app.use(function(req,res,next){
	if(req.headers.accesstoken !== config.token){
		res.status(401).end();
	}else{
		next();
	}
});*/

// Connect to Database
mongoose.connect('mongodb://localhost/anna',function(err){
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
