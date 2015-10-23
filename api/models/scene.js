const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  devices: [{
  	path: { type: String },
  	method: { type: String },
  	body: { type: String }
  }]
});

module.exports = mongoose.model('Scene', scene);