const routes = require('express').Router();
const hueService = require('../services/hueService');
const dispatch = require('../modules/dispatch');
const HueLight = require('../modules/models/hueLight');
const actions = require('../modules/actions');

function getState({ on, sat, xy, bri }) {
  const state = {};

  if (on !== undefined) {
    state.on = typeof on === 'string' ? on === 'true' : on;

    if (!state.on) {
      return state;
    }
  }

  if (!isNaN(bri)) {
    state.bri = parseInt(bri, 10);
  }

  if (!isNaN(sat)) {
    state.sat = parseInt(sat, 10);
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
      .getLight(req.params.id_light)
      .then(light => res.json(light))
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    if (req.body.name === undefined && req.body.roomId === undefined) {
      return res.sendStatus(400);
    }

    try {
      const renameLight = req.body.name
        ? hueService.renameLight(req.params.id_light, req.body.name)
        : Promise.resolve();

      const changeRoomId = req.body.roomId
        ? HueLight.findByIdAndUpdate(req.params.id_light, req.body.roomId)
        : Promise.resolve();

      Promise.all([renameLight, changeRoomId])
        .then(() => res.end())
        .catch(err => {
          res.status(500).send({ err });
        });
    } catch (err) {
      console.log(err);
    }
  });

routes.patch('/api/hue/lights/:id_light([0-9]+)/state', (req, res) => {
  const state = getState(req.body);

  if (Object.keys(state).length > 0) {
    hueService
      .setLightState(req.params.id_light, state)
      .then(result => res.json(result))
      .catch(err => res.status(500).send({ err }));
  } else {
    res.sendStatus(400);
  }
});

routes.get('/api/hue/lights/:id_light([0-9]+)/:status(on|off)', (req, res) => {
  dispatch(
    actions.toggleHueLight(req.params.id_light, req.params.status === 'on'),
  )
    .then(result => res.json(result))
    .catch(err => res.status(500).send({ err }));
});

module.exports = routes;
