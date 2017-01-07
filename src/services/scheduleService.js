const Joi = require('joi');
const Schedule = require('../models/schedule');

module.exports = () => {
  let schedules = [];

  function getAll() {
    return schedules.map(schedule => schedule.attrs);
  }

  function get(scheduleId) {
    return schedules.find(schedule => schedule.attrs.id === scheduleId);
  }

  function getIndex(scheduleId) {
    return schedules.findIndex(schedule => schedule.attrs.id === scheduleId);
  }

  function validate(props, isNew = true) {
    const newPattern = {
      name: Joi.string().trim().min(3).required(),
      interval: Joi.string().required(),
      cb: Joi.func().maxArity(1),
    };

    const updatePattern = {
      name: Joi.string().trim().min(3).required(),
      interval: Joi.string().required(),
    };

    const pattern = isNew ? newPattern : updatePattern;
    return new Promise((resolve, reject) => {
      Joi.validate(props, pattern, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function add(props) {
    if (typeof props !== 'object') {
      throw new Error('Expected the schedule to be a object.');
    }

    return validate(props, true)
      .then(() => new Schedule(props))
      .then((schedule) => {
        schedules.push(schedule);
        schedule.start();
      });
  }

  function remove(scheduleId) {
    const index = getIndex(scheduleId);
    if (index === -1) return false;

    const schedule = schedules[index];
    schedule.stop();
    schedules.splice(index, 1);
    return true;
  }

  function purge() {
    schedules.forEach(schedule => schedule.stop());
    schedules = [];
  }

  return {
    getAll,
    get,
    add,
    remove,
    purge,
  };
};
