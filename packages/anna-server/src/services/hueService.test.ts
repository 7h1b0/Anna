import knex from '../knexClient';
import * as Sensor from 'modules/hue-sensor/model';
import { uuid } from 'factories';
import fetch from 'node-fetch';

import { getSensorsByRoomId } from './hueService';

const room1 = uuid();
const room2 = uuid();
const room3 = uuid();
const hueSensorsRoom = [
  {
    sensorId: '1',
    roomId: room1,
  },
  {
    sensorId: '12',
    roomId: room2,
  },
  {
    sensorId: '34',
    roomId: room1,
  },
];

jest.mock('node-fetch', () =>
  jest.fn(() => Promise.resolve({ json: () => ({}) })),
);

describe('hueService', () => {
  beforeEach(async () => {
    await knex(Sensor.TABLE).truncate();
    await knex(Sensor.TABLE).insert(hueSensorsRoom);
  });

  describe('getSensorsByRoomId', () => {
    it('should not call fetch is none sensor is associated to a given room', async () => {
      const res = await getSensorsByRoomId(room3);

      expect(res).toHaveLength(0);
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
