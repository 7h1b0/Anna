// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const { database, hue, port } = require('./config');
const logMiddleware = require('./src/middlewares/logMiddlewares');
const requireAuthentification = require('./src/middlewares/authentificationMiddlewares');

const { hueService, scheduleService } = require('./src/services/');

// Setup Database
const uri = `mongodb://${database.hostname}:${database.port}/${database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

// Setup service(s)
hueService.init(hue.hostname, hue.token);

const schedules = requireDir('./src/schedules');
Object.keys(schedules).forEach(schedule => {
  const attrs = schedules[schedule]();
  scheduleService.add(attrs).catch(err => console.log(err));
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
