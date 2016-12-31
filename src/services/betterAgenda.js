const Agenda = require('agenda');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const Schedule = require('./../models/schedule');
const Action = require('./../utils/action');

class BetterAgenda extends Agenda {
  isPunctual(date) {
    const regex = new RegExp('\\d{13}');
    return regex.test(date);
  }

  find(query) {
    return new Promise((resolve, reject) => {
      this.jobs(query, (err, jobs) => {
        if (err) {
          reject(err);
        } else {
          resolve(jobs);
        }
      });
    });
  }

  findOne(id) {
    const newId = new mongoose.mongo.ObjectID(id);
    return new Promise((resolve, reject) => {
      this.jobs({ _id: newId }, (err, jobs) => {
        if (err) {
          reject(err);
        } else if (jobs.length === 0) {
          reject('Schedule doesn\'t exist');
        } else {
          resolve(jobs[0]);
        }
      });
    });
  }

  isNew(name) {
    return new Promise((resolve, reject) => {
      this.jobs({ name }, (err, jobs) => {
        if (err) {
          reject(err);
        } else if (jobs.length > 0) {
          reject('Schedule already exist');
        } else {
          resolve();
        }
      });
    });
  }

  removeOne(id) {
    const newId = new mongoose.mongo.ObjectID(id);
    return this.remove({ _id: newId });
  }

  remove(query) {
    return new Promise((resolve, reject) => {
      this.cancel(query, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      this.cancel({}, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  reloadSchedules() {
    const reloadUserSchedules = () => Schedule.find({}).then(schedules => {
      schedules.forEach(schedule => {
        this.createSchedule(
          schedule.name,
          schedule.date,
          () => Action(schedule.actions)
        );
      });
    });

    const requireSchedules = () => {
      const schedules = requireDir('./../schedules');
      Object.keys(schedules).forEach(schedule => {
        const job = schedules[schedule]();
        this.createScheduleFromObject(job);
      });

      return Promise.resolve();
    };

    return reloadUserSchedules().then(() => requireSchedules());
  }

  ready() {
    return new Promise(resolve => {
      this.on('ready', () => resolve());
    });
  }

  cleanLockedSchedules() {
    return new Promise(resolve => {
      this._collection.update(
        { lockedAt: { $exists: true } },
        { $set: { lockedAt: null } },
        { multi: true },
        err => resolve(err)
      );
    });
  }

  scheduleJob(date, name) {
    return new Promise((resolve, reject) => {
      this.schedule(date, name, (err, job) => {
        if (err) {
          reject(err);
        } else {
          resolve(job);
        }
      });
    });
  }

  cronJob(date, name) {
    return new Promise((resolve, reject) => {
      this.every(date, name, (err, job) => {
        if (err) {
          reject(err);
        } else {
          resolve(job);
        }
      });
    });
  }

  createScheduleFromObject({ name, date, actions }) {
    return this.createSchedule(name, date, actions);
  }

  createSchedule(name, date, actions) {
    return this.isNew(name)
      .then(() => {
        this.define(name, { concurrency: 1 }, () => Action(actions));

        return this.isPunctual(date) ?
          this.scheduleJob(new Date(date), name) : this.cronJob(date, name);
      })
      .catch(() => {
        this.define(name, { concurrency: 1 }, () => Action(actions));
        return Promise.resolve();
      });
  }

  launch(id) {
    return this.findOne(id).then(job =>
      job.run(errJob => (errJob ? Promise.reject(errJob) : Promise.resolve()))
    );
  }

  updateDate(id, date) {
    return this.findOne(id).then(job => {
      return new Promise((resolve, reject) => {
        if (this.isPunctual(date)) {
          job.schedule(date)
            .computeNextRunAt()
            .save(err => (err ? reject(err) : resolve(job)));
        } else {
          job.repeatEvery(date)
            .computeNextRunAt()
            .save(err => (err ? reject(err) : resolve(job)));
        }
      });
    });
  }
}

module.exports = BetterAgenda;
