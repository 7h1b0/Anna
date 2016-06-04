const Agenda = require('agenda');

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

  createSchedule(date, name, cb) {
    return this.exist(name)
      .then(() => {
        this.define(name, cb);

        if (this.isPunctual(date)) {
          return this.scheduleJob(new Date(date), name);
        }
        return this.cronJob(date, name);
      });
  }
}

module.exports = BetterAgenda;
