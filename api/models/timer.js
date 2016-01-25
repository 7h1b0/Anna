const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timer = new Schema({
  name: { type: String, required: true },
  time: { type: Number, required: true, min: 1 },
  actions: {
    before: [{
      path: String,
      method: String ,
      body: Object
    }],
    after: [{
      path: String,
      method: String,
      body: Object
    }]
  }
});

module.exports = mongoose.model('Timer', timer);