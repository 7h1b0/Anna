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

  app.route('/api/hue/lights')
    .get((req, res) => {
      app.service.hue.getLights()
        .then(lights => res.send(lights))
        .catch(err => res.status(500).send({ err }));
    });

  app.route('/api/hue/lights/:id_light([0-9]{1,2})')
    .get((req, res) => {
      app.service.hue.getLight(req.params.id_light)
        .then(light => res.send(light))
        .catch(err => res.status(500).send({ err }));
    })

    .put((req, res) => {
      if (req.body.name === undefined) {
        res.sendStatus(400);
      } else {
        app.service.hue.renameLight(req.params.id_light, req.body.name)
          .then(result => res.send(result))
          .catch(err => res.status(500).send({ err }));
      }
    });

  app.put('/api/hue/lights/:id_light([0-9]{1,2})/state', (req, res) => {
    const hasBody = req.body && hasProperties(req.body);
    const state = hasBody ? getState(req.body) : getState(req.query);

    if (hasProperties(state)) {
      app.service.hue.setLightState(req.params.id_light, state)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({ err }));
    } else {
      res.sendStatus(400);
    }
  });

  app.get('/api/hue/lights/:id_light([0-9]{1,2})/toggle', (req, res) => {
    app.service.hue.getLight(req.params.id_light)
      .then(light => app.service.hue.switchLight(req.params.id_light, !light.state.on))
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/hue/lights/:id_light([0-9]{1,2})/:status(on|off)', (req, res) => {
    app.service.hue.switchLight(req.params.id_light, req.params.status === 'on')
      .then(result => res.send(result))
      .catch(err => res.status(500).send({ err }));
  });
};
