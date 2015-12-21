const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: true },
  description: String,
  actions: [{
  	path: String,
  	method: String
  }]
});

module.exports = mongoose.model('Scene', scene);