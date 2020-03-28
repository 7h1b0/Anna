import knex from '../../knexClient';
import * as HueLight from './model';

const room1 = '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
const room2 = '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
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
