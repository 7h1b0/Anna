import fetch from 'node-fetch';
import { findAll, findRoomId } from 'modules/hue-light/hueLight';
import { HueLigthBody } from 'modules/scene/action';
import { XYToHex } from './hueColor';

const HUE_IP = process.env.HUE_IP;
const HUE_TOKEN = process.env.HUE_TOKEN;
const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

type ColorLight = {
  state: {
    on: boolean;
    bri: number;
    hue: number;
    sat: number;
    xy: number[];
    ct: number;
    colormode: 'hs' | 'xy';
    reachable: boolean;
    hex?: string;
  };
  type: 'Extended color light';
  name: string;
  id?: string;
};

type DimmableLight = {
  state: {
    on: boolean;
    bri: number;
    reachable: boolean;
  };
  type: 'Dimmable light';
  name: string;
  id?: string;
};

type HueLight = ColorLight | DimmableLight;

const toArray = (jsonObject): HueLight[] =>
  Object.keys(jsonObject).map(id => ({ ...jsonObject[id], id }));

const addHexColor = (hueLight: HueLight): HueLight => {
  if (
    hueLight.type === 'Extended color light' &&
    hueLight.state.colormode === 'xy'
  ) {
    const [x, y] = hueLight.state.xy;
    hueLight.state.hex = XYToHex(x, y, hueLight.state.bri);
  }

  return hueLight;
};

export async function getLights(): Promise<HueLight[]> {
  const [body, rooms] = await Promise.all([
    fetch(`${api}/lights`).then(res => res.json()),
    findAll(),
  ]);

  let correctedBody = body;

  if (body) {
    rooms.forEach(({ roomId, lightId }) => {
      if (body.hasOwnProperty(lightId)) {
        body[lightId].roomId = roomId;
      }
    });

    correctedBody = toArray(body).map(addHexColor);
  }

  return correctedBody;
}

export async function getLight(lightId: number): Promise<HueLight> {
  const [body, roomId] = await Promise.all([
    fetch(`${api}/lights/${lightId}`).then(res => res.json()),
    findRoomId(lightId),
  ]);

  return addHexColor({ ...body, ...roomId });
}

export async function renameLight(id: number, name: string): Promise<void> {
  const res = await fetch(`${api}/lights/${id}`, {
    method: 'put',
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function setLightState(
  id: string,
  body: Partial<HueLigthBody>,
): Promise<void> {
  const res = await fetch(`${api}/lights/${id}/state`, {
    method: 'put',
    body: JSON.stringify(body),
  });
  return res.json();
}
