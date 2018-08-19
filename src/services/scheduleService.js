import Ajv from 'ajv';
import Schedule from '../modules/models/schedule';
import scheduleSchema from '../modules/schemas/schedule';

let schedules = [];

export default {
  getAll() {
    return schedules.map(schedule => schedule.attrs);
  },

  get(scheduleId) {
    return schedules.find(schedule => schedule.attrs._id === scheduleId);
  },

  getIndex(scheduleId) {
    return schedules.findIndex(schedule => schedule.attrs._id === scheduleId);
  },

  validate(props) {
    const ajv = new Ajv();
    return ajv.validate(scheduleSchema, props);
  },

  add(props) {
    if (typeof props !== 'object') {
      throw new Error('Expected schedule to be an object.');
    }

    const isValid = this.validate(props);
    if (isValid) {
      const schedule = new Schedule(props);
      schedules.push(schedule);
      schedule.start();
    } else {
      throw new Error('Schedule is not valid');
    }
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
