const type = require('./type');

module.exports = {
  toggleDio(id, on) {
    return {
      type: type.DIO,
      body: { on },
      id,
    };
  },

  toggleHueLight(id, on) {
    return {
      type: type.HUE_LIGHT,
      body: { on },
      id,
    };
  },

  toggleHueGroup(id, on) {
    return {
      type: type.HUE_GROUP,
      body: { on },
      id,
    };
  },

  callScene(id) {
    return {
      type: type.SCENE,
      id,
    };
  },
};
