const mongoose = require('mongoose');
const type = require('./../helpers/actionType');
const Schema = mongoose.Schema;

const scene = new Schema({
  name: { type: String, required: [true, 'Name required'] },
  description: { type: String },
  actions: [{
    id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, enum: type.TYPE },
    body: { type: Object },
  }],
});

module.exports = mongoose.model('Scene', scene);
