const mongoose = require('mongoose');
const Dio = require('./dio');
const Schema = mongoose.Schema;

const SCENE_TYPE = ['HUE_LIGHT', 'DIO'];

const scene = new Schema({
  name: { type: String, required: [true, 'Name required'] },
  description: { type: String },
  actions: [{
    id: { type: String, required: true },
    body: { type: Object, required: true },
    type: { type: String, required: true, enum: SCENE_TYPE },
  }],
});

scene.methods.recall = function (hueService) {
  this.actions.forEach(action => {
    switch (action.type) {
      case 'HUE_LIGHT':
        hueService.setLightState(action.id, action.body);
        break;

      case 'DIO':
        Dio.updateState(action.id, action.body.on);
        break;

      default:
        break;
    }
  });
};

scene.statics.recall = function (actions, hueService) {
  actions.forEach(action => {
    switch (action.type) {
      case 'HUE_LIGHT':
        hueService.setLightState(action.id, action.body);
        break;

      case 'DIO':
        Dio.updateState(action.id, action.body.on);
        break;

      default:
        break;
    }
  });
};

module.exports = mongoose.model('Scene', scene);
