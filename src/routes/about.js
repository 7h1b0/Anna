import * as os from 'os';
import { Router } from 'express';
import * as Scene from '../modules/models/scene';
import * as Dio from '../modules/models/dio';
import * as Room from '../modules/models/room';
import * as Alias from '../modules/models/alias';
import scheduleService from '../services/scheduleService';

const routes = Router();

routes.get('/api', (req, res) => {
  const getScenes = Scene.findAll();
  const getDios = Dio.findAll();
  const getAlias = Alias.findAll();
  const getRooms = Room.findAll();
  const schedules = scheduleService.getAll();

  Promise.all([getScenes, getDios, getAlias, getRooms])
    .then(([scenes, dios, alias, rooms]) =>
      res.json({
        scenes,
        dios,
        alias,
        schedules,
        rooms,
      }),
    )
    .catch(err => res.status(500).send({ err }));
});

export default routes;
