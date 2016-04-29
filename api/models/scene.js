const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: true },
  actions: [{
    path: String,
    method: String,
    body: Object,
  }],
});

module.exports = mongoose.model('Scene', scene);
