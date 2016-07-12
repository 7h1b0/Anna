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
      const newSchedule = new Schedule({
        name: req.body.name,
        date: req.body.date,
        actions: req.body.actions,
      });

      newSchedule.save()
        .then(schedule => app.service.agenda.createSchedule(
          schedule.name,
          schedule.date,
          () => Action.call(schedule.actions, app.service.hue)
        ))
        .then(job => res.status(201).send(job))
        .catch(err => res.status(500).send({ err }));
    });

  app.route('/api/schedules/:id_schedule([0-9a-z]{24})')
    .get((req, res) => {
      app.service.agenda.findOne(req.params.id_schedule)
        .then(job => res.send(job))
        .catch(err => res.status(500).send({ err }));
    })

    .put((req, res) => {
      const id = req.params.id_schedule;
      const date = req.body.date;

      app.service.agenda.updateDate(id, date)
        .then(() => res.end())
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
