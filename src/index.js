// Dependencies
import express from 'express';
import bodyParser from 'body-parser';
// import requireDir from dir';
// import scheduleService from './src/services/scheduleService';

import about from './routes/about';
import alias from './routes/alias';
import dio from './routes/dio';
import room from './routes/room';
import hueLight from './routes/hueLight';
import log from './routes/log';
import scene from './routes/scene';
import schedule from './routes/schedule';
import user from './routes/user';

import authenticationMiddleware from './middlewares/authenticationMiddleware';
import logMiddleware from './middlewares/logMiddleware';

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

export default app;
