import knex from '../../../knexClient';
import * as Room from '../room';
import * as Dio from '../dio';
const initRooms = [
  {
    roomId: 1,
    description: 'this is a test',
    name: 'room_1',
    createdBy: 1,
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    roomId: 2,
    description: 'this is a second test',
    name: 'room_2',
    createdBy: 1,
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const dios = {
  dioId: 2,
  roomId: 2,
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
      const result = await Room.findById(1);
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
        userId: 1,
      };

      const newRoom = await Room.save(save);
      expect(newRoom).toMatchSnapshot();

      const rooms = await knex(Room.TABLE)
        .first('*')
        .where('roomId', 3);

      expect(rooms).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('delete', () => {
    it('should delete a room', async () => {
      await Room.remove(1);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual([initRooms[1]]);
    });

    it('should not delete a room', async () => {
      await Room.remove(-1);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });

    it('should not delete a room if devices are still in it', async () => {
      const res = await Room.remove(2);
      expect(res).toBe(0);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a room', async () => {
      const rowsAffected = await Room.findByIdAndUpdate(1, { name: 'updated' });
      expect(rowsAffected).toBe(1);
      const room = await knex(Room.TABLE)
        .first('*')
        .where('roomId', 1);
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
