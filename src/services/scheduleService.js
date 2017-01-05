const Joi = require('Joi');
const schedule = require('../models/schedule');

module.exports = () => {
  const schedules = [];

  function getAll() {
  }

  function get(jobId) {
    return schedules.find(schedule => schedule.attrs.id === jobId);
  }

  function getIndex(jobId) {
    return schedules.findIndex(schedule => schedule.attrs.id === jobId);
  }

  function validate(props) {
    const pattern = {
      name: Joi.string().trim().min(3).required(),
      interval: Joi.string().required(),
      cb: Joi.func().maxArity(1),
    };

    return new Promise((resolve, reject) => {
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
      throw new Error('Expected the schedule to be a object.')
    }

    return validate(props)
      .then(() => new schedule(props))
      .then(schedule => {
        schedules.push(schedule);
        schedule.start();
      });
  }

  function remove(jobId) {
    const index = getIndex(jobId);
    const schedule = schedules[index];
    schedule.stop();
  }

  function purge() {
    schedules.forEach(schedule => schedule.stop());
    schedules = [];
  }

  return {
    getAll,
    get,
    getIndex,
    add,
    remove,
    purge,
  };
};
