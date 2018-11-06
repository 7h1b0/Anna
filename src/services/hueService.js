import request from 'needle';
import { HUE_IP, HUE_TOKEN } from '../constants';
import { findAll, findRoomId } from '../modules/models/hueLight';

const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

const toArray = jsonObject =>
  Object.keys(jsonObject).map(id => ({ ...jsonObject[id], id }));

export async function getLights() {
  const [{ body }, rooms] = await Promise.all([
    request('get', `${api}/lights`),
    findAll(),
  ]);

  let correctedBody = body;

  rooms.forEach(({ roomId, lightId }) => {
    body[lightId].roomId = roomId;
  });

  if (body) {
    correctedBody = toArray(body);
  }

  return correctedBody;
}

export async function getLight(lightId) {
  const [{ body }, roomId] = await Promise.all([
    request('get', `${api}/lights/${lightId}`),
    findRoomId(lightId),
  ]);

  return { ...body, ...roomId };
}

export function renameLight(id, name) {
  return request(
    'put',
    `${api}/lights/${id}`,
    { body: { name } },
    { json: true },
  );
}

export function setLightState(id, body) {
  return request('put', `${api}/lights/${id}/state`, body, { json: true });
}
