const hueService = require('../services/hueService');
const { actions, dispatch } = require('../utils/');

module.exports = app => {
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

  app.route('/api/hue/lights').get((req, res) => {
    hueService
      .getLights()
      .then(lights => res.send(lights))
      .catch(err => res.status(500).send({ err }));
  });

  app
    .route('/api/hue/lights/:id_light([0-9]{1,2})')
    .get((req, res) => {
      hueService
        .getLight(req.params.id_light)
        .then(light => res.send(light))
        .catch(err => res.status(500).send({ err }));
    })
    .put((req, res) => {
      if (req.body.name === undefined) {
        res.sendStatus(400);
      } else {
        hueService
          .renameLight(req.params.id_light, req.body.name)
          .then(result => res.send(result))
          .catch(err => res.status(500).send({ err }));
      }
    });

  app.put('/api/hue/lights/:id_light([0-9]{1,2})/state', (req, res) => {
    const hasBody = req.body && hasProperties(req.body);
    const state = hasBody ? getState(req.body) : getState(req.query);

    if (hasProperties(state)) {
      hueService
        .setLightState(req.params.id_light, state)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({ err }));
    } else {
      res.sendStatus(400);
    }
  });

  app.get('/api/hue/lights/:id_light([0-9]{1,2})/toggle', (req, res) => {
    hueService
      .getLight(req.params.id_light)
      .then(light =>
        dispatch(actions.toggleHueLight(req.params.id_light, !light.state.on)),
      )
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });

  app.get(
    '/api/hue/lights/:id_light([0-9]{1,2})/:status(on|off)',
    (req, res) => {
      dispatch(
        actions.toggleHueLight(req.params.id_light, req.params.status === 'on'),
      )
        .then(result => res.send(result))
        .catch(err => res.status(500).send({ err }));
    },
  );
};
