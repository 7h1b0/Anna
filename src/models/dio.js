const mongoose = require('mongoose');
const Ajv = require('ajv');
const dioSchema = require('../schemas/dio');

const Schema = mongoose.Schema;

const dio = new Schema({
  id_dio: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

dio.statics.validate = function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(dioSchema, data);
};

module.exports = mongoose.model('Dio', dio);
