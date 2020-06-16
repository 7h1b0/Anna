import express from 'express';
import * as bodyParser from 'body-parser';

import alias from './modules/alias/route';
import dio from './modules/dio/route';
import room from './modules/room/route';
import hueLight from './modules/hue-light/route';
import hueSensor from './modules/hue-sensor/route';
import consumption from './modules/consumption/route';
import scene from './modules/scene/route';
import routine from './modules/routine/route';
import user from './modules/user/route';
import authentication from './modules/authentication/route';

import authenticationMiddleware from './modules/authentication/middleware';

import { load as loadRoutine } from './modules/routine/model';
import { run as runLinky } from './modules/consumption/linkyService';
const app = express();

app.use(bodyParser.json());

app.use(authentication);
app.use(authenticationMiddleware, [
  alias,
  dio,
  hueLight,
  hueSensor,
  room,
  scene,
  routine,
  user,
  consumption,
]);

if (process.env.NODE_ENV !== 'test') {
  loadRoutine();
  runLinky();
}

export default app;
