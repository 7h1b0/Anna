const mongoose = require('mongoose');
const Ajv = require('ajv');
const aliasSchema = require('../schemas/alias');

const Schema = mongoose.Schema;

const alias = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  sceneId: { type: String, required: true },
  enabled: { type: Boolean, required: true },
});

alias.statics.validate = function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(aliasSchema, data);
};

module.exports = mongoose.model('Alias', alias);
