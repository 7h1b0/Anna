import { Router } from 'express';
import * as Scene from '../modules/models/scene';
import * as Dio from '../modules/models/dio';
import * as Room from '../modules/models/room';
import * as Alias from '../modules/models/alias';
import * as Routine from '../modules/models/routine';
import * as hueService from '../services/hueService';

const routes = Router();

routes.get('/api', (req, res) => {
  const getScenes = Scene.findAll();
  const getDios = Dio.findAll();
  const getAlias = Alias.findAll();
  const getRooms = Room.findAll();
  const getRoutines = Routine.findAll();
  const getHueLights = hueService.getLights();

  Promise.all([
    getScenes,
    getDios,
    getAlias,
    getRooms,
    getRoutines,
    getHueLights,
  ])
    .then(([scenes, dios, alias, rooms, routines, hueLights]) =>
      res.json({
        scenes,
        dios,
        alias,
        rooms,
        routines,
        hueLights,
      }),
    )
    .catch(err => res.status(500).send({ err }));
});

export default routes;
