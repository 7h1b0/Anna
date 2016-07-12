const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEDULE_TYPE = ['HUE_LIGHT', 'DIO', 'SCENE'];

const schedule = new Schema({
  name: { type: String, required: [true, 'Name required'] },
  date: { type: String, required: [true, 'Date required'] },
  actions: [{
    id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, enum: SCHEDULE_TYPE },
    body: { type: Object },
  }],
});

module.exports = mongoose.model('Schedule', schedule);
