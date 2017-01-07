const type = require('./type');
const Scene = require('../models/scene');
const { hueService, dioService } = require('../services/');

module.exports = function dispatch(actions) {
  actions.forEach((action) => {
    switch (action.type) {
      case type.HUE_GROUP:
        hueService.setGroupState(action.id, action.body);
        break;

      case type.HUE_LIGHT:
        hueService.setLightState(action.id, action.body);
        break;

      case type.DIO:
        dioService.add(action.id, action.body.on);
        break;

      case type.SCENE:
        Scene.findById(action.id).then((scene) => {
          if (scene) dispatch(scene.actions);
        }).catch(err => console.log(err));
        break;

      default:
        break;
    }
  });
};
