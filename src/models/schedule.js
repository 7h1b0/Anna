const uuid = require('uuid/v4');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

class Schedule {
  constructor({ name, interval, cb, runAtBankHoliday = true }) {
    this.attrs = {};
    this.attrs._id = uuid();
    this.attrs.name = name;
    this.attrs.interval = interval;
    this.attrs.runAtBankHoliday = runAtBankHoliday;
    this.cb = cb;

    this.computeNextRunAt();
  }

  getAttrs() {
    return this.attrs;
  }

  update({ name, interval, runAtBankHoliday }) {
    this.attrs.name = name || this.attrs.name;
    this.attrs.interval = interval || this.attrs.interval;
    this.attrs.runAtBankHoliday =
      runAtBankHoliday !== undefined ? runAtBankHoliday : this.attrs.runAtBankHoliday;
    this.stop();

    this.start();
    this.computeNextRunAt();

    return this;
  }

  updateInterval(interval) {
    this.attrs.interval = interval;
    this.stop();

    this.start();
    this.computeNextRunAt();
    return this;
  }

  start() {
    this.process = new CronJob(this.attrs.interval, () => this.run(), null, true);
    this.attrs.isRunning = true;
  }

  stop() {
    this.process.stop();
    this.attrs.isRunning = false;
  }

  run() {
    this.attrs.lastRunAt = Date.now();
    this.computeNextRunAt();

    const done = (err) => {
      if (err) {
        this.attrs.failReason = err;
      } else {
        this.attrs.failReason = '';
      }
      this.attrs.lastFinishedAt = Date.now();
    };

    setImmediate(() => {
      try {
        if (this.cb.length === 0) {
          this.cb();
          done();
        } else {
          this.cb(done);
        }
      } catch (e) {
        done(e);
      }
    });
  }

  computeNextRunAt() {
    const lastRun = this.attrs.lastRunAt ? new Date(this.attrs.lastRunAt + 1000) : new Date();
    const currentDate = new Date();

    try {
      const cronTime = new CronTime(this.attrs.interval);
      let nextDate = cronTime._getNextDateFrom(currentDate);

      if (!this.attrs.runAtBankHoliday && Schedule.isBankHoliday(nextDate)) {
        nextDate = cronTime._getNextDateFrom(nextDate);
      }

      this.attrs.nextRunAt = nextDate.valueOf();
    } catch (e) {
      console.log(e);
      this.attrs.failReason = 'failed to calculate nextRunAt due to invalid interval';
      this.attrs.nextRunAt = undefined;
    }
  }

  static isBankHoliday(timestamp) {
    function getBankHolidays() {
      // http://techneilogy.blogspot.fr/2012/02/couple-of-years-ago-i-posted-source.html
      const year = new Date().getFullYear();
      const a = year % 19;
      const b = Math.floor(year / 100);
      const c = year % 100;
      const d = Math.floor(b / 4);
      const e = b % 4;
      const f = Math.floor((b + 8) / 25);
      const g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4);
      const k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const n0 = (h + l + 7 * m + 114);
      const month = Math.floor(n0 / 31) - 1;
      const day = n0 % 31 + 1;

      const jourDeLan = new Date(year, 0, 1);
      const lundiDePaques = new Date(year, month, day + 1);
      const feteDuTravail = new Date(year, 4, 1);
      const victoireDesAllies = new Date(year, 4, 8);
      const ascension = new Date(year, month, day + 39);
      const pentecote = new Date(year, month, day + 50);
      const feteNationale = new Date(year, 6, 14);
      const assomption = new Date(year, 7, 15);
      const toussaint = new Date(year, 10, 1);
      const armistice = new Date(year, 10, 11);
      const noel = new Date(year, 11, 25);

      return [
        jourDeLan,
        lundiDePaques,
        feteDuTravail,
        victoireDesAllies,
        ascension,
        pentecote,
        feteNationale,
        assomption,
        toussaint,
        armistice,
        noel,
      ];
    }

    const date = timestamp ? new Date(timestamp) : new Date();
    date.setHours(0, 0, 0, 0);
    return getBankHolidays().some(holiday => date.getTime() === holiday.getTime());
  }
}

module.exports = Schedule;
