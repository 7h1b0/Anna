const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  username: { type: String, required: [true, 'Username required'], minLength: 2, unique: true },
  password: { type: String, required: [true, 'Password required'], minLength: 5 },
  token: { type: String, required: true },
});

module.exports = mongoose.model('User', user);
