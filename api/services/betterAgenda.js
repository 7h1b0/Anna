const Agenda = require('agenda');
const mongoose = require('mongoose');

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
          resolve(jobs.map(job => job.attrs));
        }
      });
    });
  }

  findOne(id) {
    const newId = new mongoose.mongo.ObjectID(id);
    return this.find({ _id: newId }).then(jobs =>
      new Promise((resolve, reject) => {
        if (jobs) {
          resolve(jobs[0]);
        } else {
          reject();
        }
      })
    );
  }

  scheduleJob(date, name) {
    return new Promise((resolve, reject) => {
      this.schedule(date, name, (err, job) => {
        if (err) {
          reject(err);
        } else {
          resolve(job.attrs);
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
          resolve(job.attrs);
        }
      });
    });
  }

  exist(name) {
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

  remove(query) {
    return new Promise((resolve, reject) => {
      this.cancel(query, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else if (numRemoved === 0) {
          reject();
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

  createScheduleFromObject({ date, name, cb }) {
    return this.createSchedule(date, name, cb);
  }

  createSchedule(date, name, cb) {
    return this.exist(name)
      .then(() => {
        this.define(name, { concurrency: 1 }, cb);

        if (this.isPunctual(date)) {
          return this.scheduleJob(new Date(date), name);
        }
        return this.cronJob(date, name);
      });
  }

  launch(id) {
    const newId = new mongoose.mongo.ObjectID(id);
    return new Promise((resolve, reject) => {
      this.jobs({ _id: newId }, (err, jobs) => {
        if (err) {
          reject(err);
        } else {
          const job = jobs[0];
          job.run(errJob => {
            if (errJob) {
              reject(errJob);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }
}

module.exports = BetterAgenda;
