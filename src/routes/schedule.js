const routes = require('express').Router();
const scheduleService = require('../services/scheduleService');

routes.route('/api/schedules').get((req, res) => {
  const schedules = scheduleService.getAll();
  res.send(schedules);
});

routes
  .route('/api/schedules/:id_schedule([0-9a-z-]{36})')
  .get((req, res) => {
    const schedule = scheduleService.get(req.params.id_schedule);
    if (schedule) {
      res.send(schedule.attrs);
    } else {
      res.sendStatus(404);
    }
  })
  .patch((req, res) => {
    const isValid = scheduleService.validate(req.body, false);
    if (!isValid) {
      return res.sendStatus(400);
    }
    const schedule = scheduleService.get(req.params.id_schedule);
    if (schedule) {
      schedule.update(req.body);
      res.send(schedule.attrs);
    } else {
      res.sendStatus(404);
    }
  })
  .delete((req, res) => {
    const hasBeenRemoved = scheduleService.remove(req.params.id_schedule);
    if (hasBeenRemoved) {
      res.end();
    } else {
      res.status(404).send('Not schedule found');
    }
  });

routes.get(
  '/api/schedules/:id_schedule([0-9a-z-]{36})/:status(enable|disable)',
  (req, res) => {
    const schedule = scheduleService.get(req.params.id_schedule);
    if (!schedule) {
      res.status(404).send('Not schedule found');
    } else {
      if (req.params.status === 'enable') {
        schedule.start();
      } else {
        schedule.stop();
      }
      res.end();
    }
  },
);

routes.get('/api/schedules/:id_schedule([0-9a-z-]{36})/action', (req, res) => {
  const schedule = scheduleService.get(req.params.id_schedule);
  if (schedule) {
    schedule.run();
    res.end();
  } else {
    res.status(404).send('Not schedule found');
  }
});

module.exports = routes;
