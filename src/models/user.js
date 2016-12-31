const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const user = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});

user.statics.validate = function validate(data, callback) {
  const pattern = {
    username: Joi.string().trim().min(4).required(),
    password: Joi.string().trim().min(4).required(),
  };

  Joi.validate(data, pattern, callback);
};

module.exports = mongoose.model('User', user);
