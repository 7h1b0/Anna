const mongoose = require('mongoose');
const Ajv = require('ajv');
const userSchema = require('../schemas/user');

const Schema = mongoose.Schema;

const user = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});

user.statics.validate = function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(userSchema, data);
};

module.exports = mongoose.model('User', user);
