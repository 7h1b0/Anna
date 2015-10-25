const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timer = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  time: { type: Number, required: true, min: 1000 },
  actions: {
    before: [{
      path: { type: String },
      method: { type: String },
      body: { type: String }
    }],
    after: [{
      path: { type: String },
      method: { type: String },
      body: { type: String }
    }]
  }
});

module.exports = mongoose.model('Timer', timer);