const hueService = require('../services/hueService');
const { dispatch, actions } = require('../utils/');

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

  app
    .route('/api/hue/groups')
    .get((req, res) => {
      hueService
        .getGroups()
        .then(groups => res.send(groups))
        .catch(err => res.status(500).send({ err }));
    })
    .post((req, res) => {
      hueService
        .createGroup(req.body)
        .then(id => res.send(id))
        .catch(err => res.status(500).send({ err }));
    });

  app
    .route('/api/hue/groups/:id_group([0-9]{1,2})')
    .get((req, res) => {
      hueService
        .getGroup(req.params.id_group)
        .then(group => res.send(group))
        .catch(err => res.status(500).send({ err }));
    })
    .put((req, res) => {
      if (req.body.name === undefined) {
        res.sendStatus(400);
      } else {
        hueService
          .renameGroup(req.params.id_group, req.body.name)
          .then(result => res.send(result))
          .catch(err => res.status(500).send({ err }));
      }
    })
    .delete((req, res) => {
      hueService
        .deleteGroup(req.params.id_group)
        .then(id => res.send(id))
        .catch(err => res.status(500).send({ err }));
    });

  app.put('/api/hue/groups/:id_group([0-9]{1,2})/state', (req, res) => {
    const hasBody = req.body && hasProperties(req.body);
    const state = hasBody ? getState(req.body) : getState(req.query);

    if (hasProperties(state)) {
      hueService
        .setGroupState(req.params.id_group, state)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({ err }));
    } else {
      res.sendStatus(400);
    }
  });

  app.get(
    '/api/hue/groups/:id_group([0-9]{1,2})/:status(on|off)',
    (req, res) => {
      dispatch(
        actions.toggleHueGroup(req.params.id_group, req.params.status === 'on'),
      )
        .then(result => res.send(result))
        .catch(err => res.status(500).send({ err }));
    },
  );

  app.get('/api/hue/groups/:id_group([0-9]{1,2})/toggle', (req, res) => {
    hueService
      .getGroup(req.params.id_group)
      .then(hueGroup =>
        dispatch(
          actions.toggleHueGroup(req.params.id_group, !hueGroup.action.on),
        ),
      )
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });
};
