const MockDate = require('mockdate');
const knex = require('../../../knexClient');
const Room = require('../room');
const Dio = require('../dio');
const initRooms = [
  {
    room_id: 1,
    description: 'this is a test',
    name: 'room_1',
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
  },
  {
    room_id: 2,
    description: 'this is a second test',
    name: 'room_2',
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
  },
];

const dios = {
  dio_id: 2,
  room_id: 2,
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
    MockDate.reset();
    await knex(Room.TABLE).truncate();
  });

  afterAll(async () => {
    await knex(Dio.TABLE).truncate();
    await knex.destroy();
  });

  describe('findAll', () => {
    it('should return all room', async () => {
      const result = await Room.findAll();
      expect(result).toMatchSnapshot();
    });
  });

  describe('findById', () => {
    it('should return only one room', async () => {
      const result = await Room.findById(1);
      expect(result).toMatchSnapshot();
    });

    it('should return undefined', async () => {
      const result = await Room.findById(-1);
      expect(result).toBe(undefined);
    });
  });

  describe('save', () => {
    it('should save a new room', async () => {
      MockDate.set('2018-05-05');
      const save = {
        name: 'test-save',
        description: 'test',
        userId: 1,
      };

      const newRoom = await Room.save(save);
      expect(newRoom).toEqual({
        roomId: 3,
        name: 'test-save',
        description: 'test',
      });

      const rooms = await knex(Room.TABLE)
        .select('*')
        .where('room_id', 3);

      expect(rooms).toMatchSnapshot();
    });
  });

  describe('delete', () => {
    it('should delete a room', async () => {
      await Room.delete(1);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toMatchSnapshot();
    });

    it('should not delete a room', async () => {
      await Room.delete(-1);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });

    it('should not delete a room if devices are still in it', async () => {
      const res = await Room.delete(2);
      expect(res).toBe(0);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toEqual(initRooms);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a room', async () => {
      MockDate.set('2018-05-05');
      const rowsAffected = await Room.findByIdAndUpdate(1, { name: 'updated' });
      expect(rowsAffected).toBe(1);
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toMatchSnapshot();
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
