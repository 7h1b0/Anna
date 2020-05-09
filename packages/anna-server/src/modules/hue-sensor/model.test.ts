import knex from '../../knexClient';
import * as Sensor from './model';

const room1 = '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
const room2 = '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
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

describe('HueSensor', () => {
  beforeEach(async () => {
    await knex(Sensor.TABLE).truncate();
    await knex(Sensor.TABLE).insert(hueSensorsRoom);
  });

  describe('findAll', () => {
    it('should return all sensors', async () => {
      const result = await Sensor.findAll();
      expect(result).toEqual(hueSensorsRoom);
    });
  });

  describe('findByRoomId', () => {
    it('should return all sensors id from a given room', async () => {
      const result = await Sensor.findByRoomId(room1);
      expect(result).toEqual(['1', '34']);
    });

    it('should return an empty array if room is unknown or empty', async () => {
      const result = await Sensor.findByRoomId('test');
      expect(result).toEqual([]);
    });
  });

  describe('insertOrUpdate', () => {
    it('should create a new sensor', async () => {
      const sensors = await Sensor.findByRoomId(room2);
      expect(sensors).toEqual(['12']);

      await Sensor.insertOrUpdate('14', room2);
      const sensorsAfterInsert = await Sensor.findByRoomId(room2);
      expect(sensorsAfterInsert).toEqual(['12', '14']);
    });

    it('should update an existing sensor', async () => {
      const sensors = await Sensor.findByRoomId(room2);
      expect(sensors).toEqual(['12']);

      await Sensor.insertOrUpdate('12', room1);
      const sensorsAfterUpdate = await Sensor.findByRoomId(room2);
      expect(sensorsAfterUpdate).toHaveLength(0);

      const result = await Sensor.findByRoomId(room1);
      expect(result).toEqual(['1', '12', '34']);
    });
  });

  describe('remove', () => {
    it('should remove a given sensor', async () => {
      await Sensor.remove('12');
      const sensors = await Sensor.findByRoomId(room2);
      expect(sensors).toHaveLength(0);
    });
  });
});
