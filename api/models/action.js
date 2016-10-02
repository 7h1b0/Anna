const Dio = require('./dio');
const Scene = require('./scene');

module.exports = {
  HUE_LIGHT: 'HUE_LIGHT',
  DIO: 'DIO',
  SCENE: 'SCENE',
  HUE_GROUP: 'HUE_GROUP',
  TYPE: [this.HUE_LIGHT, this.DIO, this.SCENE, this.HUE_GROUP],

  call(actions, hueService) {
    actions.forEach(action => {
      switch (action.type) {
        case this.HUE_GROUP:
          hueService.setGroupState(action.id, action.body);
          break;

        case this.HUE_LIGHT:
          hueService.setLightState(action.id, action.body);
          break;

        case this.DIO:
          Dio.updateState(action.id, action.body.on);
          break;

        case this.SCENE:
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
  },
};
