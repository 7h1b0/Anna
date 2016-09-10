module.exports = app => {
  function hasProperties(object) {
    return Object.keys(object).length > 0;
  }

  function getState(body) {
    const state = {};

    if (body.on !== undefined) {
      state.on = typeof body.on === 'string' ? body.on === 'true' : body.on;

      if (!state.on) {
        return state;
      }
    }

    const bri = body.bri;
    if (!isNaN(bri)) {
      state.bri = parseInt(bri, 10);
    }

    const sat = body.sat;
    if (!isNaN(sat)) {
      state.sat = parseInt(sat, 10);
    }

    const xy = body.xy;
    if (Array.isArray(xy)) {
      state.xy = xy.map(item => parseFloat(item));
    }

    return state;
  }

  app.route('/api/hue/groups')
    .get((req, res) => {
      app.service.hue.getGroups()
        .then(groups => res.send(groups))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      app.service.hue.createGroup(req.body)
        .then(id => res.send(id))
        .catch(err => res.status(500).send({ err }));
    });

  app.route('/api/hue/groups/:id_group([0-9]{1,2})')
    .get((req, res) => {
      app.service.hue.getGroup(req.params.id_group)
        .then(group => res.send(group))
        .catch(err => res.status(500).send({ err }));
    })

    .put((req, res) => {
      if (req.body.name === undefined) {
        res.sendStatus(400);
      } else {
        app.service.hue.renameGroup(req.params.id_group, req.body.name)
          .then(result => res.send(result))
          .catch(err => res.status(500).send({ err }));
      }
    })

    .delete((req, res) => {
      app.service.hue.deleteGroup(req.params.id_group)
        .then(id => res.send(id))
        .catch(err => res.status(500).send({ err }));
    });

  app.put('/api/hue/groups/:id_group([0-9]{1,2})/state', (req, res) => {
    const hasBody = req.body && hasProperties(req.body);
    const state = hasBody ? getState(req.body) : getState(req.query);

    if (hasProperties(state)) {
      app.service.hue.setGroupState(req.params.id_group, state)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({ err }));
    } else {
      res.sendStatus(400);
    }
  });

  app.get('/api/hue/groups/:id_group([0-9]{1,2})/:status(on|off)', (req, res) => {
    app.service.hue.switchGroup(req.params.id_group, req.params.status === 'on')
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/hue/groups/:id_group([0-9]{1,2})/toggle', (req, res) => {
    app.service.hue.getGroup(req.params.id_group)
      .then(hueGroup => app.service.hue.switchGroup(req.params.id_group, !hueGroup.action.on))
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });
};
