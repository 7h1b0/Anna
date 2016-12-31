// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const { database, hue, port } = require('./config');
const logMiddleware = require('./src/middlewares/logMiddlewares');
const requireAuthentification = require('./src/middlewares/authentificationMiddlewares');
const hueService = require('./src/services/hueService');
const executorService = require('./src/services/executorService');
const BetterAgenda = require('./src/services/betterAgenda');

// Setup Database
const uri = `mongodb://${database.hostname}:${database.port}/${database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

// Create Agenda
const agenda = new BetterAgenda();

// Setup service(s)
hueService.init(hue.hostname, hue.token);
executorService.init();

app.service = {};
app.service.agenda = agenda;

// Setup BetterAgenda
agenda.database(`${database.hostname}:27017/agenda-test`, 'agendaJobs');
agenda.processEvery('30 seconds');
agenda.ready()
  .then(() => agenda.cleanLockedSchedules())
  .then(() => agenda.reloadSchedules())
  .then(err => {
    if (err) {
      throw err;
    }

    agenda.start();
    console.log('BetterAgenda ready');
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

// Setup Server
app.use(bodyParser.json());
app.listen(port);
app.all('/api/*', requireAuthentification, logMiddleware);

// Setup routes
const routes = requireDir('./src/routes');
Object.keys(routes).forEach(name => routes[name](app));

// Default Controller
app.use((req, res) => res.sendStatus(404));

// Event
function stop() {
  agenda.stop(() => {
    console.warn('Anna shutdown');
    process.exit(0);
  });
}

process.on('SIGTERM', () => stop());
process.on('SIGINT', () => stop());
