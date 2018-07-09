const request = require('./requestService');
const { HUE_IP, HUE_TOKEN } = require('../constants');
const hueLight = require('../modules/models/hueLight');

const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

const toArray = jsonObject =>
  Object.keys(jsonObject).map(id => Object.assign({}, jsonObject[id], { id }));

module.exports = {
  getLights() {
    return Promise.all([request.get(`${api}/lights`), hueLight.findAll()]).then(
      ([body, rooms]) => {
        let correctedBody = body;

        rooms.forEach(({ roomId, lightId }) => {
          body[lightId].roomId = roomId;
        });

        if (body) {
          correctedBody = toArray(body);
        }
        return correctedBody;
      },
    );
  },

  getLight(id) {
    return Promise.all([
      request.get(`${api}/lights/${id}`),
      hueLight.findRoomId(id),
    ]).then(([light, roomId]) => {
      return Object.assign({}, light, roomId);
    });
  },

  renameLight(id, name) {
    return request.put(`${api}/lights/${id}`, { name });
  },

  setLightState(id, body) {
    return request.put(`${api}/lights/${id}/state`, body);
  },
};
