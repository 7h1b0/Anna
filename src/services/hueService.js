const request = require('./requestService');
const { HUE_IP, HUE_TOKEN } = require('../constants');

const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

const toArray = jsonObject =>
  Object.keys(jsonObject).map(id => Object.assign({}, jsonObject[id], { id }));

module.exports = {
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
};
