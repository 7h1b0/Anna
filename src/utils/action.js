const Dio = require('../models/dio');
const Scene = require('../models/scene');
const type = require('./type');
const hueService = require('../services/hueService');

module.exports = function dispatch(actions) {
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
          if (scene) dispatch(scene.actions);
        });
        break;

      default:
        break;
    }
  });
};
