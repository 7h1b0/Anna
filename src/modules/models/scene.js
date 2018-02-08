const Ajv = require('ajv');
const sceneSchema = require('../schemas/scene');

module.exports = {
  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(sceneSchema, data);
  },
};
