// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const { database, hue, port } = require('./config');
const logMiddleware = require('./api/middlewares/logMiddlewares');
const requireAuthentification = require('./api/middlewares/authentificationMiddlewares');
const HueService = require('./api/services/hueService');
const BetterAgenda = require('./api/services/betterAgenda');

// Setup Database
const uri = `mongodb://${database.hostname}:${database.port}/${database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

// Create Agenda
const agenda = new BetterAgenda();

// Setup service(s)
app.service = {};
app.service.hue = new HueService(hue.hostname, hue.token);
app.service.agenda = agenda;

// Setup BetterAgenda
agenda.database('localhost:27017/agenda-test', 'agendaJobs');
agenda.processEvery('30 seconds');
agenda.on('ready', () => {
  agenda.start();

  const schedules = requireDir('./api/schedules');
  Object.keys(schedules).forEach(schedule => {
    const job = schedules[schedule](app);
    agenda.createScheduleFromObject(job);
  });
});

// Setup Server
app.use(bodyParser.json());
app.listen(port);
app.all('/api/*', requireAuthentification, logMiddleware);

// Setup routes
const routes = requireDir('./api/routes');
Object.keys(routes).forEach(name => routes[name](app));

// Default Controller
app.use((req, res) => res.sendStatus(404));

// Event
function stop() {
  agenda.clear()
    .then(() => agenda.stop(() => {
      console.warn('Anna shutdown');
      process.exit(0);
    }))
    .catch(err => agenda.stop(() => {
      console.warn(err, 'Anna shutdown');
      process.exit(1);
    }));
}

process.on('SIGTERM', () => stop());
process.on('SIGINT', () => stop());
