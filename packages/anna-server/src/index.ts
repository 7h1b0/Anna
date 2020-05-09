import express from 'express';
import * as bodyParser from 'body-parser';

import about from './modules/about/route';
import alias from './modules/alias/route';
import dio from './modules/dio/route';
import room from './modules/room/route';
import hueLight from './modules/hue-light/route';
import hueSensor from './modules/hue-sensor/route';
import scene from './modules/scene/route';
import routine from './modules/routine/route';
import user from './modules/user/route';
import authentication from './modules/authentication/route';

import authenticationMiddleware from './modules/authentication/middleware';

import { load as loadRoutine } from './services/routineService';
const app = express();

app.use(bodyParser.json());

app.use(authentication);
app.use(authenticationMiddleware, [
  about,
  alias,
  dio,
  hueLight,
  hueSensor,
  room,
  scene,
  routine,
  user,
]);

loadRoutine();

export default app;
