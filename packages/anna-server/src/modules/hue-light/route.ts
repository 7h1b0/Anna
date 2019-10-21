import { Router } from 'express';
import * as hueService from 'services/hueService';
import dispatch from 'utils/dispatch';
import { toggleHueLight } from 'utils/actions';
import * as HueLight from 'modules/hue-light/hueLight';
import { HueLigthBody } from 'modules/scene/action';

const routes = Router();
function getState({ on, xy, bri }) {
  const state: Partial<HueLigthBody> = {};

  if (on !== undefined) {
    state.on = typeof on === 'string' ? on === 'true' : on;

    if (!state.on) {
      return state;
    }
  }

  if (!isNaN(bri)) {
    state.bri = parseInt(bri, 10);
  }

  if (Array.isArray(xy)) {
    state.xy = xy.map(item => parseFloat(item));
  }

  return state;
}

routes.route('/api/hue/lights').get((req, res) => {
  hueService
    .getLights()
    .then(lights => res.json(lights))
    .catch(err => res.status(500).send({ err }));
});

routes
  .route('/api/hue/lights/:id_light([0-9]+)')
  .get((req, res) => {
    hueService
      .getLight(Number(req.params.id_light))
      .then(light => res.json(light))
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    if (req.body.name === undefined && req.body.roomId === undefined) {
      return res.sendStatus(400);
    }

    const renameLight = req.body.name
      ? hueService.renameLight(Number(req.params.id_light), req.body.name)
      : Promise.resolve();

    const changeRoomId = req.body.roomId
      ? HueLight.findByIdAndUpdate(Number(req.params.id_light), req.body.roomId)
      : Promise.resolve();

    Promise.all([renameLight, changeRoomId])
      .then(() => res.sendStatus(204))
      .catch(err => {
        res.status(500).send({ err });
      });
  })
  .post((req, res) => {
    if (req.body.roomId === undefined) {
      return res.sendStatus(400);
    }

    HueLight.save(Number(req.params.id_light), req.body.roomId)
      .then(() => res.sendStatus(204))
      .catch(err => {
        res.status(500).send({ err });
      });
  });

routes.patch('/api/hue/lights/:id_light([0-9]+)/state', (req, res) => {
  const state = getState(req.body);

  if (Object.keys(state).length > 0) {
    hueService
      .setLightState(req.params.id_light, state)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send({ err }));
  } else {
    res.sendStatus(400);
  }
});

routes.get('/api/hue/lights/:id_light([0-9]+)/:status(on|off)', (req, res) => {
  dispatch(toggleHueLight(req.params.id_light, req.params.status === 'on'))
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send({ err }));
});

export default routes;
