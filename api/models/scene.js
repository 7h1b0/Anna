const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: true },
  description: String,
  actions: [{
  	path: String,
  	method: String,
  	body: { 
  		sat: Number,
  		bri: Number,
  		xy: Array,
  		on: Boolean
  	}
  }]
});

module.exports = mongoose.model('Scene', scene);