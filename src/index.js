// Dependencies
const app = require('express')();

const bodyParser = require('body-parser');
// const requireDir = require('require-dir');

const { PORT } = require('./constants');
// const scheduleService = require('./src/services/scheduleService');

const about = require('./routes/about');
const alias = require('./routes/alias');
const dio = require('./routes/dio');
const room = require('./routes/room');
const hueLight = require('./routes/hueLight');
const log = require('./routes/log');
const scene = require('./routes/scene');
const schedule = require('./routes/schedule');
const user = require('./routes/user');

const middlewares = require('./middlewares/');
const logger = require('./modules/logger');

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
room(app);
hueLight(app);
log(app);
scene(app);
schedule(app);
user(app);

app.listen(PORT, () => {
  logger.info(`Anna is listening on port ${PORT}`);
});

// app.use((req, res) => res.sendStatus(404));
