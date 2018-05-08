const knex = require('../../../knexClient');
const Room = require('../room');
const initRooms = [
  {
    room_id: 1,
    description: 'this is a test',
    name: 'room_1',
  },
  {
    room_id: 2,
    description: 'this is a second test',
    name: 'room_2',
  },
];

beforeAll(async () => {
  await knex(Room.TABLE).truncate();
});

describe('Room', () => {
  beforeEach(async () => {
    await knex(Room.TABLE).insert(initRooms);
  });

  afterEach(async () => {
    await knex(Room.TABLE).truncate();
  });

  describe('findAll', () => {
    it('should return all room', async () => {
      const expected = [
        {
          roomId: 1,
          description: 'this is a test',
          name: 'room_1',
        },
        {
          roomId: 2,
          description: 'this is a second test',
          name: 'room_2',
        },
      ];

      const result = await Room.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return only one room', async () => {
      const expected = {
        roomId: 1,
        description: 'this is a test',
        name: 'room_1',
      };

      const result = await Room.findById(1);
      expect(result).toEqual(expected);
    });

    it('should return undefined', async () => {
      const result = await Room.findById(-1);
      expect(result).toBe(undefined);
    });
  });

  describe('save', () => {
    it('should save a new room', async () => {
      const save = {
        name: 'test-save',
        description: 'test',
      };

      const expected = [
        {
          room_id: 3,
          name: 'test-save',
          description: 'test',
        },
      ];

      await Room.save(save);
      const rooms = await knex(Room.TABLE)
        .select('*')
        .where('room_id', 3);

      expect(rooms).toEqual(expected);
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
  });

  describe('findByIdAndUpdate', () => {
    it('should update a room', async () => {
      await Room.findByIdAndUpdate(1, { name: 'updated' });
      const rooms = await knex(Room.TABLE).select('*');
      expect(rooms).toMatchSnapshot();
    });

    it('should not update a room', async () => {
      await Room.findByIdAndUpdate(-1, { name: 'updated' });
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
