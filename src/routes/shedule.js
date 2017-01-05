const { scheduleService } = require('../services/');
const Action = require('./../utils/dispatch');
const getJoiError = require('../utils/errorUtil');

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
      const id = req.params.id_schedule;
      const date = req.body.repeatInterval;

      const updatedSchedule =
        scheduleService.get(req.params.id_schedule).update(req.body);

      res.send(updatedSchedule.attrs);
    })

    .delete((req, res) => {
      scheduleService.remove(req.params.id_schedule)
      res.end();
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
