const mongoose = require('mongoose');
const Joi = require('joi');
const type = require('../utils/type');
const Schema = mongoose.Schema;

const schedule = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  actions: [{
    id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true },
    body: { type: Object, required: true },
  }],
});

schedule.statics.validate = function validate(data, callback) {
  const pattern = {
    name: Joi.string().trim().min(3).required(),
    date: Joi.string().required(),
    actions: Joi.array().min(1).items(Joi.object().keys({
      id: Joi.any().required(),
      name: Joi.string().min(3),
      type: Joi.any().valid(type.TYPES).required(),
      body: Joi.object().min(1).required(),
    })),
  };

  Joi.validate(data, pattern, callback);
};

module.exports = mongoose.model('Schedule', schedule);
