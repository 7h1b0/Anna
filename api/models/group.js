const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const group = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  devices: [ String ]
});

module.exports = mongoose.model('Group', group);