// Dependencies
var app = require('express')(),
	bodyParser = require('body-parser'),
	mysql = require('mysql'),
	command = require('./controllers/command');
	os = require('./controllers/os');

// Configure
app.use(bodyParser.json());


// Connect to Database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'anna',
  password : 'anna',
  database: 'anna'
});
connection.connect();

// Controllers
command.init(app,connection);
os.init(app);

// Default Controller
app.use(function(req, res){
	res.status(404).end('404');
});

app.listen(8080);