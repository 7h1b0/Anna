// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // prevent warning message mpromise is deprecated
const requireDir = require('require-dir');

const { database, port } = require('./config.json');
const scheduleService = require('./src/services/scheduleService');
const routes = require('./src/routes/');
const middlewares = require('./src/middlewares/');

// Setup Database
const uri = `mongodb://${database.hostname}:${database.port}/${database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

const schedules = requireDir('./assets/schedules');
const loadSchedules = Object.keys(schedules).map((schedule) => {
  const attrs = schedules[schedule]();
  return scheduleService.add(attrs).catch(err => console.log(err));
});

Promise.all(loadSchedules).then(() => console.log('Schedules loaded :)'));

// Setup Server
app.use(bodyParser.json());
app.all('/api/*', middlewares);
routes.forEach(route => route(app));
app.listen(port, () => {
  console.log(`Anna is listening on port ${port}`);
});

app.use((req, res) => res.sendStatus(404));
