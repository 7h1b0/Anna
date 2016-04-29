const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const log = new Schema({
  date: { type: Date, default: Date.now, expires: '15d' },
  ip: { type: String, required: true },
  httpMethod: String,
  path: String,
  userID: String,
});

module.exports = mongoose.model('Log', log);
