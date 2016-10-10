const requireDir = require('require-dir');
const Action = require('./../models/action');

module.exports = app => {
  const sensorDir = requireDir('./../sensors');
  const sensors = [];

  function isValidState(state) {
    const states = sensors.reduce((prev, sensor) => prev.concat(sensor.getState()), []);
    return states.indexOf(state) !== -1;
  }

  function on(state) {
    Action.findOne({ state }).then(action => {
      Action.call(action, app.service.hue);
    });
  }

  Object.keys(sensorDir).forEach(name => {
    const sensor = sensorDir[name](app, on);
    sensor.listen();
    sensors.push(sensor);
  });

  app.get('/api/sensors/states', (req, res) => {
    const states = sensors.reduce((prev, sensor) => prev.concat(sensor.getState()), []);
    res.send({ states });
  });

  app.post('/api/sensors', (req, res) => {
    if (isValidState(req.body.state)) {
      const newAction = new Action({
        state: req.body.state,
        actions: req.body.actions,
      });

      newAction.save()
        .then(action => res.status(201).send(action))
        .catch(err => res.status(500).send({ err }));
    } else {
      res.status(400).send({ err: 'Bad state' });
    }
  });
};
