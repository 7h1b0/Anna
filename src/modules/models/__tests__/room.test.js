import knex from '../../../knexClient';
import * as Room from '../room';
import * as Dio from '../dio';
const initRooms = [
  {
    roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    description: 'this is a test',
    name: 'room_1',
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    roomId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    description: 'this is a second test',
    name: 'room_2',
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const dios = {
  dioId: 2,
  roomId: initRooms[1].roomId,
  name: 'test',
};

describe('Room', () => {
  beforeAll(async () => {
    await knex(Room.TABLE).truncate();
    await knex(Dio.TABLE).insert(dios);
  });

  beforeEach(async () => {
    await knex(Room.TABLE).insert(initRooms);
  });

  afterEach(async () => {
    await knex(Room.TABLE).truncate();
  });

  afterAll(async () => {
    await knex(Dio.TABLE).truncate();
    await knex.destroy();
  });

  describe('findAll', () => {
    it('should return all room', async () => {
      const result = await Room.findAll();
      expect(result).toEqual(initRooms);
    });
  });

  describe('findById', () => {
    it('should return only one room', async () => {
      const result = await Room.findById(initRooms[0].roomId);
      expect(result).toEqual(initRooms[0]);
    });

    it('should return undefined', async () => {
      const result = await Room.findById(-1);
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new room', async () => {
      const save = {
        name: 'test-save',
        description: 'test',
        userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
      };

      const newRoomId = await Room.save(save);
      const rooms = await knex(Room.TABLE)
        .first('*')
        .where('roomId', newRoomId);

      expect(rooms).toMatchSnapshot({
        roomId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('delete', () => {
    it('should delete a room', async () => {
      await Room.remove(initRooms[0].roomId);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual([initRooms[1]]);
    });

    it('should not delete a room', async () => {
      await Room.remove(-1);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });

    it('should not delete a room if devices are still in it', async () => {
      const res = await Room.remove(initRooms[1].roomId);
      expect(res).toBe(0);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a room', async () => {
      const rowsAffected = await Room.findByIdAndUpdate(initRooms[0].roomId, {
        name: 'updated',
      });
      expect(rowsAffected).toBe(1);
      const room = await knex(Room.TABLE)
        .first('*')
        .where('roomId', initRooms[0].roomId);
      expect(room).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should not update a room', async () => {
      const rowsAffected = await Room.findByIdAndUpdate(-1, {
        name: 'updated',
      });
      expect(rowsAffected).toBe(0);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });
  });

  describe('validate', () => {
    it('should return true when a room is valid', () => {
      const room = {
        name: 'room',
        description: 'test',
      };

      expect(Room.validate(room)).toBeTruthy();
    });

    it('should return false when a room is missing a props', () => {
      const room = {
        description: 'test',
      };

      expect(Room.validate(room)).toBeFalsy();
    });

    it('should return false when a room has unknow props', () => {
      const room = {
        name: 'room',
        description: 'test',
        test: 'test',
      };

      expect(Room.validate(room)).toBeFalsy();
    });
  });
});
