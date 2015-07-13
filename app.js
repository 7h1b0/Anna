// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	sqlite3 = require('sqlite3'),
	db = new sqlite3.Database('anna.db'),

	device = require('./controllers/device'),
	schedule = require('./controllers/schedule'),
	os = require('./controllers/os');

// Configure
app.use(bodyParser.json());

// Controllers
device.init(app,db);
schedule.init(app);
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});

app.listen(8081);