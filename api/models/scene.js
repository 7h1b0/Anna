const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCENE_TYPE = ['HUE_LIGHT', 'DIO', 'SCENE'];

const scene = new Schema({
  name: { type: String, required: [true, 'Name required'] },
  description: { type: String },
  actions: [{
    id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, enum: SCENE_TYPE },
    body: { type: Object },
  }],
});

module.exports = mongoose.model('Scene', scene);
