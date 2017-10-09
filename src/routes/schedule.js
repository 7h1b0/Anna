const scheduleService = require('../services/scheduleService');
const { getJoiError } = require('../utils/');

module.exports = (app) => {
  app.route('/api/schedules')
    .get((req, res) => {
      const schedules = scheduleService.getAll();
      res.send(schedules);
    });

  app.route('/api/schedules/:id_schedule([0-9a-z\-]{36})')
    .get((req, res) => {
      const schedule = scheduleService.get(req.params.id_schedule);
      if (schedule) {
        res.send(schedule.attrs);
      } else {
        res.sendStatus(404);
      }
    })

    .put((req, res) => {
      scheduleService.validate(req.body, false)
        .then((validatedSchedule) => {
          const schedule = scheduleService.get(req.params.id_schedule);
          if (schedule) {
            const updatedSchedule = schedule.update(validatedSchedule);
            res.send(updatedSchedule.attrs);
          } else {
            res.sendStatus(404);
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(getJoiError(err));
        });
    })

    .delete((req, res) => {
      const hasBeenRemoved = scheduleService.remove(req.params.id_schedule);
      if (hasBeenRemoved) {
        res.end();
      } else {
        res.status(404).send('Not schedule found');
      }
    });

  app.get('/api/schedules/:id_schedule([0-9a-z\-]{36})/:status(enable|disable)', (req, res) => {
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
  });

  app.get('/api/schedules/:id_schedule([0-9a-z\-]{36})/action', (req, res) => {
    const schedule = scheduleService.get(req.params.id_schedule);
    if (schedule) {
      schedule.run();
      res.end();
    } else {
      res.status(404).send('Not schedule found');
    }
  });
};
