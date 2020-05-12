import knex from '../../knexClient';
import * as HueLight from './model';
import { uuid } from 'factories';

const room1 = uuid();
const room2 = uuid();
const hueLightRooms = [
  {
    lightId: 1,
    roomId: room1,
  },
  {
    lightId: 2,
    roomId: room2,
  },
  {
    lightId: 3,
    roomId: room1,
  },
];

describe('HueLight', () => {
  beforeEach(async () => {
    await knex(HueLight.TABLE).truncate();
    await knex(HueLight.TABLE).insert(hueLightRooms);
  });

  describe('findAll', () => {
    it('should return all association', async () => {
      const result = await HueLight.findAll();
      expect(result).toEqual(hueLightRooms);
    });
  });

  describe('findByRoomId', () => {
    it('should return all light id from a given room', async () => {
      const result = await HueLight.findByRoomId(room1);
      expect(result).toEqual([1, 3]);
    });

    it('should return an empty array if room is unknown or empty', async () => {
      const result = await HueLight.findByRoomId('test');
      expect(result).toEqual([]);
    });
  });
});
