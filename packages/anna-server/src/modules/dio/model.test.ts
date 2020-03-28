import knex from '../../knexClient';
import * as Dio from './model';

const room1 = '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
const room2 = '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
const initDios = [
  {
    dioId: 1,
    roomId: room1,
    name: 'test_1',
  },
  {
    dioId: 2,
    roomId: room1,
    name: 'test_2',
  },
  {
    dioId: 3,
    roomId: room2,
    name: 'test_3',
  },
];

describe('Dio', () => {
  beforeEach(async () => {
    await knex(Dio.TABLE).truncate();
    await knex(Dio.TABLE).insert(initDios);
  });

  describe('findAll', () => {
    it('should return all dios', async () => {
      const result = await Dio.findAll();
      expect(result).toEqual(initDios);
    });
  });

  describe('findById', () => {
    it('should return only one dio', async () => {
      const result = await Dio.findById(initDios[0].dioId);
      expect(result).toEqual(initDios[0]);
    });

    it('should return undefined', async () => {
      const result = await Dio.findById(-1);
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new dio', async () => {
      const save = {
        dioId: 4,
        roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test-save',
      };

      const newDio = await Dio.save(save);
      expect(newDio).toEqual(save);
      const dios = await knex(Dio.TABLE).first().where('dioId', save.dioId);
      expect(dios).toEqual(save);
    });

    it('should reject when an id is already taken', async () => {
      const save = {
        dioId: 2,
        roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test-save',
      };

      await expect(Dio.save(save)).rejects.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a dio', async () => {
      await Dio.remove(1);
      const dios = await knex(Dio.TABLE).select();
      expect(dios).toHaveLength(2);
      expect(dios[0]).toHaveProperty('dioId', 2);
      expect(dios[1]).toHaveProperty('dioId', 3);
    });

    it('should not delete a dio', async () => {
      await Dio.remove(-1);
      const dios = await knex(Dio.TABLE).select();
      expect(dios).toHaveLength(initDios.length);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update correctly a dio', async () => {
      const rowsAffected = await Dio.findByIdAndUpdate(1, {
        roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
        name: 'updated',
      });
      expect(rowsAffected).toBe(1);
      const dios = await knex(Dio.TABLE).select();
      expect(dios).toMatchSnapshot();
    });

    it('should not update a dio', async () => {
      const rowsAffected = await Dio.findByIdAndUpdate(-1, { name: 'updated' });
      expect(rowsAffected).toBe(0);
      const dios = await knex(Dio.TABLE).select();
      expect(dios).toEqual(initDios);
    });
  });

  describe('validate', () => {
    it('should return true when a dio is valid', () => {
      const dio = {
        dioId: 3,
        roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test-save',
      };

      expect(Dio.validate(dio)).toBeTruthy();
    });

    it('should return false when a dio is missing a props', () => {
      const dio = {
        dioId: 3,
        name: 'test-save',
      };

      expect(Dio.validate(dio)).toBeFalsy();
    });

    it('should return false when a dio has unknow props', () => {
      const dio = {
        dioId: 3,
        roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test-save',
        test: 2,
      };

      expect(Dio.validate(dio)).toBeFalsy();
    });
  });

  describe('findByRoomId', () => {
    it('should return only dios in a given room', async () => {
      const result = await Dio.findByRoomId(room1);
      expect(result).toEqual([initDios[0], initDios[1]]);
    });

    it('should return an empty list when roomId is empty or unknown', async () => {
      const result = await Dio.findByRoomId('hey');
      expect(result).toHaveLength(0);
    });
  });
});
