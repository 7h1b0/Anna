const Dio = require('./dio');
const Scene = require('./scene');

module.exports = {
  call(actions, hueService) {
    actions.forEach(action => {
      switch (action.type) {
        case 'HUE_LIGHT':
          hueService.setLightState(action.id, action.body);
          break;

        case 'DIO':
          Dio.updateState(action.id, action.body.on);
          break;

        case 'SCENE':
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
