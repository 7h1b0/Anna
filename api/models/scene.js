const mongoose = require('mongoose');
const action = require('./action');
const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: [true, 'Name required'] },
  description: { type: String },
  actions: [{
    id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, enum: action.TYPE },
    body: { type: Object },
  }],
});

module.exports = mongoose.model('Scene', scene);
