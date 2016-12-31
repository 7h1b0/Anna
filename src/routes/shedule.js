const Schedule = require('./../models/schedule');
const Action = require('./../utils/action');
const getJoiError = require('../utils/errorUtil');

module.exports = (app) => {
  app.route('/api/schedules')
    .get((req, res) => {
      app.service.agenda.find({})
        .then(jobs => res.send(jobs))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      Schedule.validate(req.body, (err, schedule) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          const newSchedule = new Schedule({
            name: schedule.name,
            date: schedule.date,
            actions: schedule.actions,
          });

          newSchedule.save()
            .then(schedule => app.service.agenda.createSchedule(
              schedule.name,
              schedule.date,
              () => Action(schedule.actions)
            ))
            .then(job => res.status(201).send(job))
            .catch(err => res.status(500).send({ err }));
        }
      });
    });

  app.route('/api/schedules/:id_schedule([0-9a-z]{24})')
    .get((req, res) => {
      app.service.agenda.findOne(req.params.id_schedule)
        .then(job => res.send(job))
        .catch(err => res.status(500).send({ err }));
    })

    .put((req, res) => {
      const id = req.params.id_schedule;
      const date = req.body.repeatInterval;

      app.service.agenda.updateDate(id, date)
        .then(job => res.send(job))
        .catch(err => res.status(500).send({ err }));
    })

    .delete((req, res) => {
      Schedule.findByIdAndRemove(req.params.id_schedule)
        .then(() => app.service.agenda.removeOne(req.params.id_schedule))
        .then(() => res.end())
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/schedules/:id_schedule([0-9a-z]{24})/action', (req, res) => {
    app.service.agenda.launch(req.params.id_schedule)
      .then(() => res.end())
      .catch(err => res.status(500).send({ err }));
  });
};
