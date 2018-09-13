// Dependencies
import express from 'express';
import bodyParser from 'body-parser';

import about from './routes/about';
import alias from './routes/alias';
import dio from './routes/dio';
import room from './routes/room';
import hueLight from './routes/hueLight';
import log from './routes/log';
import scene from './routes/scene';
import routine from './routes/routine';
import user from './routes/user';

import authenticationMiddleware from './middlewares/authenticationMiddleware';
import logMiddleware from './middlewares/logMiddleware';

import { load as loadRoutine } from './services/routineService';

// Setup Server
const app = express();
app.use(bodyParser.json());
app.all('/api*', [authenticationMiddleware, logMiddleware]);

app.use([about, alias, dio, hueLight, log, room, scene, routine, user]);
app.use((req, res) => res.sendStatus(404));

loadRoutine();

export default app;
