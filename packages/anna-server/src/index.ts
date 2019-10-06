import express from 'express';
import * as bodyParser from 'body-parser';

import about from './routes/about';
import alias from './routes/alias';
import dio from './routes/dio';
import room from './routes/room';
import hueLight from './routes/hueLight';
import scene from './routes/scene';
import routine from './routes/routine';
import user from './routes/user';
import authentication from './routes/authentication';

import authenticationMiddleware from './middlewares/authenticationMiddleware';
import serveFront from './middlewares/serveFile';

import { load as loadRoutine } from './services/routineService';
const app = express();

app.use(bodyParser.json());

app.use(authentication);
app.use(authenticationMiddleware, [
  about,
  alias,
  dio,
  hueLight,
  room,
  scene,
  routine,
  user,
]);
app.use(serveFront);

loadRoutine();

export default app;
