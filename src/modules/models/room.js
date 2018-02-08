const Ajv = require('ajv');

module.exports = {
  TABLE: 'rooms',

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(sceneSchema, data);
  },
};
