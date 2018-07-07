// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
// const requireDir = require('require-dir');
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

const authenticationMiddleware = require('./middlewares/authenticationMiddleware');
const logMiddleware = require('./middlewares/logMiddleware');

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
const app = express();
app.use(bodyParser.json());
app.all('/api*', [authenticationMiddleware, logMiddleware]);

app.use([about, alias, dio, hueLight, log, room, scene, schedule, user]);
app.use((req, res) => res.sendStatus(404));

module.exports = app;
