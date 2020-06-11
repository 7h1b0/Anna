import fetch from 'node-fetch';
import * as HueLightModel from 'modules/hue-light/model';
import * as HueSensorModel from 'modules/hue-sensor/model';
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
  roomId?: string;
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
  roomId?: string;
  id?: string;
};

export type TemperatureSensor = {
  id: string;
  state: {
    temperature: number;
    lastupdated: string;
  };
  type: 'ZLLTemperature';
};

export type HueLight = ColorLight | DimmableLight;

function toArray<T>(jsonObject): T[] {
  return Object.keys(jsonObject).map((id) => ({ ...jsonObject[id], id }));
}

function addHexColor(hueLight: HueLight): HueLight {
  if (
    hueLight.type === 'Extended color light' &&
    hueLight.state.colormode === 'xy'
  ) {
    const [x, y] = hueLight.state.xy;
    hueLight.state.hex = XYToHex(x, y, hueLight.state.bri);
  }

  return hueLight;
}

export async function getLights(): Promise<HueLight[]> {
  const [lights, rooms] = await Promise.all([
    fetch(`${api}/lights`).then((res) => res.json()),
    HueLightModel.findAll(),
  ]);

  if (lights) {
    rooms.forEach(({ roomId, lightId }) => {
      if (Object.prototype.hasOwnProperty.call(lights, 'lightId')) {
        lights[lightId].roomId = roomId;
      }
    });

    return toArray<HueLight>(lights).map(addHexColor);
  }

  return lights;
}

export async function getLight(lightId: number): Promise<HueLight> {
  const [body, roomId] = await Promise.all([
    fetch(`${api}/lights/${lightId}`).then((res) => res.json()),
    HueLightModel.findRoomId(lightId),
  ]);

  return addHexColor({ ...body, ...roomId, id: lightId });
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
  return await res.json();
}

export async function getSensorsByRoomId(
  roomId: string,
): Promise<TemperatureSensor[]> {
  const [sensors, sensorsId] = await Promise.all([
    fetch(`${api}/sensors`).then((res) => res.json()),
    HueSensorModel.findByRoomId(roomId),
  ]);

  if (sensors) {
    return toArray<TemperatureSensor>(sensors).filter((sensor) =>
      sensorsId.includes(sensor.id),
    );
  }

  return sensors;
}

export async function getSensor(idSensor: string): Promise<TemperatureSensor> {
  const sensor = fetch(`${api}/sensors/${idSensor}`).then((res) => res.json());

  return Object.assign(sensor, { id: idSensor });
}

export async function getSensors(): Promise<TemperatureSensor[]> {
  const [sensors, rooms] = await Promise.all([
    fetch(`${api}/sensors/`).then((res) => res.json()),
    HueSensorModel.findAll(),
  ]);

  if (sensors) {
    rooms.forEach(({ roomId, sensorId }) => {
      if (Object.prototype.hasOwnProperty.call(sensors, sensorId)) {
        sensors[sensorId].roomId = roomId;
      }
    });

    return toArray<TemperatureSensor>(sensors);
  }

  return sensors;
}
