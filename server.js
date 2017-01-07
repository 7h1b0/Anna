// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const { database, port } = require('./config.json');
const { scheduleService } = require('./src/services/');
const routes = require('./src/routes/');
const middlewares = require('./src/middlewares/');

// Setup Database
const uri = `mongodb://${database.hostname}:${database.port}/${database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

const schedules = requireDir('./assets/schedules');
Object.keys(schedules).forEach((schedule) => {
  const attrs = schedules[schedule]();
  scheduleService.add(attrs).catch(err => console.log(err));
});

// Setup Server
app.use(bodyParser.json());
app.all('/api/*', middlewares);
routes.forEach(route => route(app));
app.listen(port);

app.use((req, res) => res.sendStatus(404));
