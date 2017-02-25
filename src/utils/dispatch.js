const type = require('./type');
const Scene = require('../models/scene');
const Alias = require('../models/alias');
const { hueService, dioService } = require('../services/');

module.exports = function dispatch(actions) {
  actions.forEach(({ type, id, body }) => {
    switch (type) {
      case type.HUE_GROUP:
        hueService.setGroupState(id, body);
        break;

      case type.HUE_LIGHT:
        hueService.setLightState(id, body);
        break;

      case type.DIO:
        dioService.add(id, body.on);
        break;

      case type.SCENE:
        Scene.findById(id).then((scene) => {
          if (scene) {
            dispatch(scene.actions);
          } else {
            console.warn(`Cannot find scene ${id}`);
          }
        }).catch(err => console.error(err));
        break;

      case type.ALIAS:
        Alias.findOne({ name: id })
          .then((alias) => {
            if (!alias) {
              console.warn(`Cannot find alias ${id}`);
            } else {
              return Scene.findById(alias.sceneId);
            }
          })
          .then((scene) => {
            if (!scene) {
              console.warn(`Cannot find scene associated with alias ${id}`);
            } else {
              dispatch(scene.actions);
            }
          })
          .catch(err => console.error(err));
        break;

      default:
        break;
    }
  });
};
