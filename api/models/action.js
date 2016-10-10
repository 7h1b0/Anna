const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dio = require('./dio');
const Scene = require('./scene');
const type = require('./../helpers/actionType');

const actionSchema = new Schema({
  state: { type: String },
  actions: [{
    id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, enum: type.TYPE },
    body: { type: Object },
  }],
});

actionSchema.statics.call = function (actions, hueService) {
  actions.forEach(action => {
    switch (action.type) {
      case type.HUE_GROUP:
        hueService.setGroupState(action.id, action.body);
        break;

      case type.HUE_LIGHT:
        hueService.setLightState(action.id, action.body);
        break;

      case type.DIO:
        Dio.updateState(action.id, action.body.on);
        break;

      case type.SCENE:
        Scene.findById(action.id).then(scene => {
          if (scene) {
            this.call(scene.actions, hueService);
          }
        });
        break;

      default:
        break;
    }
  });
};

module.exports = mongoose.model('Action', actionSchema);
