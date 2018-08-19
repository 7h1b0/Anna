import * as request from './requestService';
import { HUE_IP, HUE_TOKEN } from '../constants';
import { findAll, findRoomId } from '../modules/models/hueLight';

const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

const toArray = jsonObject =>
  Object.keys(jsonObject).map(id => ({ ...jsonObject[id], id }));

export function getLights() {
  return Promise.all([request.get(`${api}/lights`), findAll()]).then(
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
}

export function getLight(id) {
  return Promise.all([request.get(`${api}/lights/${id}`), findRoomId(id)]).then(
    ([light, roomId]) => {
      return { ...light, ...roomId };
    },
  );
}

export function renameLight(id, name) {
  return request.put(`${api}/lights/${id}`, { name });
}

export function setLightState(id, body) {
  return request.put(`${api}/lights/${id}/state`, body);
}
