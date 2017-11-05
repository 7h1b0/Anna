const mongoose = require('mongoose');
const Ajv = require('ajv');
const sceneSchema = require('../schemas/scene');

const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  actions: [
    {
      id: { type: String, required: true },
      name: { type: String },
      type: { type: String, required: true },
      body: { type: Object, required: true },
    },
  ],
});

scene.statics.validate = function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(sceneSchema, data);
};

module.exports = mongoose.model('Scene', scene);
