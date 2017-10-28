const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const alias = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  sceneId: { type: String, required: true },
  enabled: { type: Boolean, required: true },
});

alias.statics.validate = function validate(data, callback) {
  const pattern = {
    name: Joi.string()
      .regex(/^[a-z_]{5,}$/)
      .required(),
    description: Joi.string()
      .trim()
      .min(5)
      .required(),
    sceneId: Joi.string()
      .regex(/^[a-z0-9]{24}$/)
      .required(),
    enabled: Joi.boolean().required(),
  };
  Joi.validate(data, pattern, callback);
};

module.exports = mongoose.model('Alias', alias);
