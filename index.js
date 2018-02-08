// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // prevent warning message mpromise is deprecated
const requireDir = require('require-dir');

const { DATABASE_IP, DATABASE_PORT, DATABASE_NAME, PORT } = require('./src/constants');
const scheduleService = require('./src/services/scheduleService');
const routes = require('./src/routes/');
const middlewares = require('./src/middlewares/');
const logger = require('./src/modules/logger');

// Setup Database
const uri = `mongodb://${DATABASE_IP}:${DATABASE_PORT}/${DATABASE_NAME}`;
mongoose.connect(uri, {
  useMongoClient: true,
});

const schedules = requireDir('./assets/schedules');
Object.keys(schedules).forEach(schedule => {
  const attrs = schedules[schedule]();
  try {
    scheduleService.add(attrs);
  } catch (error) {
    logger.error(error);
  }
});
logger.info('Schedules loaded :)');

// Setup Server
app.use(bodyParser.json());
app.all('/api/*', middlewares);
routes.forEach(route => route(app));
app.listen(PORT, () => {
  logger.info(`Anna is listening on port ${PORT}`)
});

app.use((req, res) => res.sendStatus(404));
