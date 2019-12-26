import { Router } from 'express';
import * as Scene from 'modules/scene/model';
import * as Dio from 'modules/dio/model';
import * as Room from 'modules/room/model';
import * as Alias from 'modules/alias/model';
import * as Routine from 'modules/routine/model';
import * as hueService from 'services/hueService';

const routes = Router();

routes.get('/api', (req, res) => {
  Promise.all([
    Scene.findAll(),
    Dio.findAll(),
    Alias.findAll(),
    Room.findAll(),
    Routine.findAll(),
    hueService.getLights().catch(() => []),
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
