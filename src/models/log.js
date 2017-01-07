const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logSchema = new Schema({
  date: { type: Date, default: Date.now, expires: '15d' },
  ip: { type: String, required: true },
  httpMethod: String,
  path: String,
  username: String,
});

module.exports = mongoose.model('Log', logSchema);
