const request = require('./requestService');
const { HUE_IP, HUE_TOKEN } = require('../constants');

const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

const toArray = jsonObject =>
  Object.keys(jsonObject).map(id =>
    Object.assign({}, jsonObject[id], { _id: id }),
  );

const extractId = jsonArray => jsonArray[0].success.id;

module.exports = {
  // -----------------------------------------
  // Lights API
  getLights() {
    return request.get(`${api}/lights`).then(body => {
      let correctedBody = body;
      if (body) {
        correctedBody = toArray(body);
      }
      return correctedBody;
    });
  },

  getLight(id) {
    return request.get(`${api}/lights/${id}`);
  },

  renameLight(id, name) {
    return request.put(`${api}/lights/${id}`, { name });
  },

  setLightState(id, body) {
    return request.put(`${api}/lights/${id}/state`, body);
  },

  switchLight(id, on) {
    return this.setLightState(id, { on });
  },

  // -----------------------------------------
  // Scenes API
  getScenes() {
    return request.get(`${api}/scenes`).then(body => {
      let correctedBody = body;
      if (body) {
        correctedBody = toArray(body);
      }
      return correctedBody;
    });
  },

  getScene(id) {
    return request.get(`${api}/scenes/${id}`);
  },

  createScene(scene) {
    return request.post(`${api}/scenes`, scene).then(body => extractId(body));
  },

  setScene(id, body) {
    return request.put(`${api}/scenes/${id}`, body);
  },

  setSceneLightStates(id, idLight, body) {
    return request.put(`${api}/scenes/${id}/lightstates/${idLight}`, body);
  },

  deleteScene(id) {
    return request.delete(`${api}/scenes/${id}`);
  },

  recallScene(id) {
    return request.put(`${api}/groups/0/action`, { scene: id });
  },

  // -----------------------------------------
  // Groups API
  getGroups() {
    return request.get(`${api}/groups`).then(body => {
      let correctedBody = body;
      if (body) {
        correctedBody = toArray(body);
      }
      return correctedBody;
    });
  },

  getGroup(id) {
    return request.get(`${api}/groups/${id}`);
  },

  createGroup(group) {
    const filteredGroup = {};
    filteredGroup.name = group.name;
    filteredGroup.type = group.type;
    filteredGroup.lights = group.lights.map(light => `${light}`);

    return request
      .post(`${api}/groups`, filteredGroup)
      .then(body => extractId(body));
  },

  renameGroup(id, name) {
    return request.put(`${api}/groups/${id}`, { name });
  },

  setGroupState(id, state) {
    return request.put(`${api}/groups/${id}/action`, state);
  },

  deleteGroup(id) {
    return request.delete(`${api}/groups/${id}`);
  },

  switchGroup(id, on) {
    return this.setGroupState(id, { on });
  },

  // -----------------------------------------
  // Rules API
  getRules() {
    return request.get(`${api}/rules`).then(body => {
      let correctedBody = body;
      if (body) {
        correctedBody = toArray(body);
      }
      return correctedBody;
    });
  },

  getRule(id) {
    return request.get(`${api}/rules/${id}`);
  },

  createRule(rule) {
    return request.post(`${api}/rules`, rule).then(body => extractId(body));
  },

  setRule(id, body) {
    return request.put(`${api}/rules/${id}`, body);
  },

  deleteRule(id) {
    return request.delete(`${api}/rules/${id}`);
  },

  // -----------------------------------------
  // Sensors API
  getSensors() {
    return request.get(`${api}/sensors`).then(body => {
      let correctedBody = body;
      if (body) {
        correctedBody = toArray(body);
      }
      return correctedBody;
    });
  },

  getSensor(id) {
    return request.get(`${api}/sensors/${id}`);
  },

  createSensor(sensor) {
    return request.post(`${api}/sensors`, sensor).then(body => extractId(body));
  },

  setSensor(id, body) {
    return request.put(`${api}/sensors/${id}`, body);
  },

  setSensorConfig(id, body) {
    return request.put(`${api}/sensors/${id}/config`, body);
  },

  setSensorState(id, body) {
    return request.put(`${api}/sensors/${id}/state`, body);
  },

  deleteSensor(id) {
    return request.delete(`${api}/sensors/${id}`);
  },

  // -----------------------------------------
  // State API
  getState() {
    return this.getLights();
  },

  restoreState(state) {
    const promises = state.map(lighState =>
      request.setLightState(lighState._id, lighState.state),
    );

    return Promise.all(promises);
  },
};
