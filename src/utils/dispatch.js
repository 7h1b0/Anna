const { HUE_GROUP, HUE_LIGHT, DIO, SCENE } = require('./type');
const Scene = require('../models/scene');
const { hueService, dioService } = require('../services/');

module.exports = function dispatch({ type, id, body }) {
  switch (type) {
    case HUE_GROUP:
      return hueService.setGroupState(id, body);

    case HUE_LIGHT:
      return hueService.setLightState(id, body);

    case DIO:
      return dioService.add(id, body.on);

    case SCENE:
      return Scene.findById(id).then((scene) => {
        if (scene) {
          return Promise.all(scene.actions.map(dispatch));
        }
        return Promise.reject(`Cannot find scene ${id}`);
      });

    default:
      return Promise.reject();
  }
};
