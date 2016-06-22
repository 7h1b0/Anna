/**
 * https://github.com/rschmukler/agenda/issues/332
 */

const Schedule = require('./../models/schedule');
const Action = require('./../models/action');

module.exports = app => {
  function toTimestamp(jobs) {
    return new Promise(resolve => {
      if (Array.isArray(jobs)) {
        const newJobs = jobs.map(job => {
          const nextRunAt = new Date(job.nextRunAt).getTime();
          const lastRunAt = new Date(job.lastRunAt).getTime();
          return Object.assign(job, { nextRunAt, lastRunAt });
        });
        resolve(newJobs);
      } else {
        const nextRunAt = new Date(jobs.nextRunAt).getTime();
        const lastRunAt = new Date(jobs.lastRunAt).getTime();
        const newJob = Object.assign(jobs, { nextRunAt, lastRunAt });
        resolve(newJob);
      }
    });
  }

  app.route('/api/schedules')
    .get((req, res) => {
      app.service.agenda.find({})
        .then(jobs => toTimestamp(jobs))
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
        .then(job => toTimestamp(job))
        .then(job => res.status(201).send(job))
        .catch(err => res.status(500).send({ err }));
      } else {
        res.sendStatus(400);
      }
    });

  app.route('/api/schedules/:id_schedule([0-9a-z]{24})')
    .get((req, res) => {
      app.service.agenda.findOne(req.params.id_schedule)
        .then(job => toTimestamp(job))
        .then(job => res.send(job))
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
};
