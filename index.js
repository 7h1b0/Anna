// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
const requireDir = require('require-dir');

const { PORT } = require('./src/constants');
const scheduleService = require('./src/services/scheduleService');

const about = require('./src/routes/about');
const alias = require('./src/routes/alias');
const dio = require('./src/routes/dio');
const hueLight = require('./src/routes/hueLight');
const log = require('./src/routes/log');
const scene = require('./src/routes/scene');
const schedule = require('./src/routes/schedule');
const user = require('./src/routes/user');


const middlewares = require('./src/middlewares/');
const logger = require('./src/modules/logger');


// const schedules = requireDir('./assets/schedules');
// Object.keys(schedules).forEach(schedule => {
//   const attrs = schedules[schedule]();
//   try {
//     scheduleService.add(attrs);
//   } catch (error) {
//     logger.error(error);
//   }
// });
// logger.info('Schedules loaded :)');

// Setup Server
app.use(bodyParser.json());
app.all('/api/*', middlewares);

about(app);
alias(app);
dio(app);
hueLight(app);
log(app);
scene(app);
schedule(app);
user(app);

app.listen(PORT, () => {
  logger.info(`Anna is listening on port ${PORT}`)
});

// app.use((req, res) => res.sendStatus(404));
