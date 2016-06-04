const Schedule = require('./../models/schedule');
const Scene = require('./../models/scene');
const mongoose = require('mongoose');

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
        app.service.agenda.createSchedule(schedule.date, schedule.name, () =>
          Scene.recall(schedule.actions, app.service.hue)
        )
        .then(job => res.status(201).send(job))
        .catch(err => res.status(500).send({ err }));
      } else {
        res.sendStatus(400);
      }
    });

  app.route('/api/schedules/:id_schedule([0-9a-z]{24})')
    .get((req, res) => {
      const newId = new mongoose.mongo.ObjectID(req.params.id_schedule);
      app.service.agenda.find({ _id: newId })
        .then(jobs => res.send(jobs))
        .catch(err => res.status(500).send({ err }));
    })

    .delete((req, res) => {
      const newId = new mongoose.mongo.ObjectID(req.params.id_schedule);
      app.service.agenda.remove({ _id: newId })
        .then(() => res.end())
        .catch(err => res.status(500).send({ err }));
    });
};
