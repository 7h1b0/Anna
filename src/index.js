import express from 'express';
import bodyParser from 'body-parser';

import about from './routes/about';
import alias from './routes/alias';
import dio from './routes/dio';
import room from './routes/room';
import hueLight from './routes/hueLight';
import scene from './routes/scene';
import routine from './routes/routine';
import user from './routes/user';

import authenticationMiddleware from './middlewares/authenticationMiddleware';

import { load as loadRoutine } from './services/routineService';

const app = express();
app.use(bodyParser.json());
app.all('/api*', [authenticationMiddleware]);

app.use([about, alias, dio, hueLight, room, scene, routine, user]);

loadRoutine();

export default app;
