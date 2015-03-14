// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('anna.db'),
	command = require('./controllers/command'),
	os = require('./controllers/os');

// Configure
app.use(bodyParser.json());

// Controllers
command.init(app,db);
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});

app.listen(8080);