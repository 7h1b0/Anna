const routes = require('express').Router();
const hueService = require('../services/hueService');
const dispatch = require('../modules/dispatch');
const actions = require('../modules/actions');

function hasProperties(object) {
  return Object.keys(object).length > 0;
}

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
    .then(lights => res.send(lights))
    .catch(err => res.status(500).send({ err }));
});

routes
  .route('/api/hue/lights/:id_light([0-9]+)')
  .get((req, res) => {
    hueService
      .getLight(req.params.id_light)
      .then(light => res.send(light))
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    if (req.body.name === undefined) {
      return res.sendStatus(400);
    }
    hueService
      .renameLight(req.params.id_light, req.body.name)
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });

routes.patch('/api/hue/lights/:id_light([0-9]+)/state', (req, res) => {
  const state = getState(req.body);

  if (Object.keys(state).length > 0) {
    hueService
      .setLightState(req.params.id_light, state)
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  } else {
    res.sendStatus(400);
  }
});

routes.get('/api/hue/lights/:id_light([0-9]+)/:status(on|off)', (req, res) => {
  dispatch(
    actions.toggleHueLight(req.params.id_light, req.params.status === 'on'),
  )
    .then(result => res.send(result))
    .catch(err => res.status(500).send({ err }));
});

module.exports = routes;
