// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mysql = require('mysql'),

	action = require('./controllers/action'),
	// event = require('./controllers/event'),
	command = require('./controllers/command');
	// os = require('./controllers/os');

// Configure
app.use(bodyParser.urlencoded({
	extended: true
}));


// Connect to Database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'homeJS'
});

connection.connect();

// Controllers
action.init(app);
command.init(app,connection);
// event.init(app);
// event.check();
// os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});

app.listen(8080);
console.log("Serveur sur le port 8080");

