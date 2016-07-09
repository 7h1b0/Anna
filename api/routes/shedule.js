/**
 * https://github.com/rschmukler/agenda/issues/332
 */

const Schedule = require('./../models/schedule');
const Action = require('./../models/action');

module.exports = app => {
  app.route('/api/schedules')
    .get((req, res) => {
      app.service.agenda.find({})
        .then(jobs => res.send(jobs))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      const schedule = req.body;
      if (Schedule.isValid(schedule)) {
        app.service.agenda.createSchedule(schedule.date, schedule.name, (job, done) => {
          Action.call(schedule.actions, app.service.hue);
          done();
        })
        .then(job => res.status(201).send(job))
        .catch(err => res.status(500).send({ err }));
      } else {
        res.sendStatus(400);
      }
    });

  app.route('/api/schedules/:id_schedule([0-9a-z]{24})')
    .put((req, res) => {
      const id = req.params.id_schedule;
      const date = req.body.date;

      app.service.agenda.update(id, date)
        .then(() => res.end())
        .catch(err => res.status(500).send({ err }));
    })

    .delete((req, res) => {
      app.service.agenda.removeOne(req.params.id_schedule)
        .then(() => res.end())
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/schedules/:id_schedule([0-9a-z]{24})/action', (req, res) => {
    app.service.agenda.launch(req.params.id_schedule)
      .then(() => res.end())
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/schedules/clear', (req, res) => {
    app.service.agenda.clear()
      .then(numRemoved => res.send({ numRemoved }))
      .catch(err => res.status(500).send({ err }));
  });
};
