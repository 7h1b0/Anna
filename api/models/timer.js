const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timer = new Schema({
  name: { type: String, required: true },
  description: String,
  time: { type: Number, required: true, min: 1 },
  actions: {
    before: [{
      path: String,
      method: String ,
      body: String
    }],
    after: [{
      path: String,
      method: String,
      body: String
    }]
  }
});

module.exports = mongoose.model('Timer', timer);