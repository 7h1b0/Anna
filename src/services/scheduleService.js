const Joi = require('joi');
const Schedule = require('../models/schedule');

let schedules = [];

module.exports = {

  getAll() {
    return schedules.map(schedule => schedule.attrs);
  },

  get(scheduleId) {
    return schedules.find(schedule => schedule.attrs._id === scheduleId);
  },

  getIndex(scheduleId) {
    return schedules.findIndex(schedule => schedule.attrs._id === scheduleId);
  },

  validate(props, isNew = true) {
    const newPattern = {
      name: Joi.string().trim().min(3).required(),
      interval: Joi.string().required(),
      cb: Joi.func().maxArity(1),
      runAtPublicHoliday: Joi.boolean().required(),
    };

    const updatePattern = {
      name: Joi.string().trim().min(3).required(),
      interval: Joi.string().required(),
      runAtPublicHoliday: Joi.boolean().required(),
    };

    const pattern = isNew ? newPattern : updatePattern;
    return new Promise((resolve, reject) => {
      Joi.validate(props, pattern, { allowUnknown: true, stripUnknown: true }, (err, schedule) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedule);
        }
      });
    });
  },

  add(props) {
    if (typeof props !== 'object') {
      throw new Error('Expected schedule to be an object.');
    }

    return this.validate(props, true)
      .then(() => new Schedule(props))
      .then((schedule) => {
        schedules.push(schedule);
        schedule.start();
      });
  },

  remove(scheduleId) {
    const index = this.getIndex(scheduleId);
    if (index === -1) return false;

    const schedule = schedules[index];
    schedule.stop();
    schedules.splice(index, 1);
    return true;
  },

  purge() {
    schedules.forEach(schedule => schedule.stop());
    schedules = [];
  },
};
