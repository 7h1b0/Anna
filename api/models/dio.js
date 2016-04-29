const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dio = new Schema({
  id_dio: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('Dio', dio);
