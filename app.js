// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mysql = require('mysql'),

	//event = require('./controllers/event'),
	command = require('./controllers/command');
	os = require('./controllers/os');

// Configure
app.use(bodyParser.json());


// Connect to Database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'anna'
});
connection.connect();

// Controllers
command.init(app,connection);
//event.init(app,connection);
// event.check();
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});

app.listen(8080);
console.log("Serveur sur le port 8080");

