// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const config = require('./config');
const logMiddleware = require('./api/middlewares/logMiddlewares');
const requireAuthentification = require('./api/middlewares/authentificationMiddlewares');
const HueService = require('./api/services/hueService');
const BetterAgenda = require('./api/services/betterAgenda');

// Setup Database
const uri = `mongodb://${config.database.hostname}:${config.database.port}/${config.database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

// Setup BetterAgenda
const agenda = new BetterAgenda();
agenda.database('localhost:27017/agenda-test', 'agendaJobs');
agenda.on('ready', () => {
  console.log('BetterAgenda Ready :)');
  agenda.start();
});

// Setup service(s)
app.service = {};
app.service.hue = new HueService(config.hue.hostname, config.hue.token);
app.service.agenda = agenda;

// Setup Server
app.use(bodyParser.json());
app.listen(config.port);
app.all('/api/*', requireAuthentification, logMiddleware);

// Setup routes
const dir = requireDir('./api/routes');
Object.keys(dir).forEach(route => dir[route](app));

// Default Controller
app.use((req, res) => res.sendStatus(404));
