const mongoose = require('mongoose');
const Joi = require('joi');
const executorService = require('./../services/executorService.js');
const Schema = mongoose.Schema;

const dio = new Schema({
  id_dio: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

dio.statics.updateState = function updateState(device, on = false) {
  const status = on ? 1 : 0;
  executorService.add(`./radioEmission ${device} ${status}`);
};

dio.statics.validate = function validate(data, callback) {
  const pattern = {
    id_dio: Joi.number().integer().required(),
    name: Joi.string().trim().min(3).required(),
  }

  Joi.validate(data, pattern, callback);
}

dio.statics.pattern = function getPattern() {
  return {
    id_dio: Joi.number().integer().required(),
    name: Joi.string().trim().min(3).required(),
  };
};

module.exports = mongoose.model('Dio', dio);
