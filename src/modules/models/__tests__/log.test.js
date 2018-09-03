import knex from '../../../knexClient';
import * as Log from '../log';
const initDios = [
  {
    id: 1,
    httpMethod: 'GET',
    path: '/test',
    ip: '127.0.0.1',
    username: 'test',
    createdAt: new Date(2017, 1, 1),
  },
  {
    id: 2,
    httpMethod: 'PATH',
    path: '/test/second',
    ip: '127.0.0.1',
    username: 'test',
    createdAt: new Date(2018, 1, 1),
  },
];

describe('Logs', () => {
  beforeAll(async () => {
    await knex(Log.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Log.TABLE).insert(initDios);
  });

  afterEach(async () => {
    await knex(Log.TABLE).truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('findWithLimit', () => {
    it('should return all logs', async () => {
      const expected = [
        {
          httpMethod: 'PATH',
          path: '/test/second',
          ip: '127.0.0.1',
          username: 'test',
          createdAt: new Date(2018, 1, 1),
        },
        {
          httpMethod: 'GET',
          path: '/test',
          ip: '127.0.0.1',
          username: 'test',
          createdAt: new Date(2017, 1, 1),
        },
      ];

      const result = await Log.findWithLimit(1000);
      expect(result).toEqual(expected);
    });

    it('should return only one log', async () => {
      const expected = [
        {
          httpMethod: 'PATH',
          path: '/test/second',
          ip: '127.0.0.1',
          username: 'test',
          createdAt: new Date(2018, 1, 1),
        },
      ];

      const result = await Log.findWithLimit(1);
      expect(result).toEqual(expected);
    });
  });

  describe('save', () => {
    it('should save a new log and return it', async () => {
      const save = {
        id: 3,
        httpMethod: 'PATH',
        path: '/test/third',
        ip: '127.0.0.1',
        username: 'test',
      };

      const expected = [
        {
          httpMethod: 'PATH',
          path: '/test/third',
          ip: '127.0.0.1',
          username: 'test',
          createdAt: expect.any(Date),
        },
      ];

      await Log.save(save);
      const result = await Log.findWithLimit(1);
      expect(result).toEqual(expected);
    });
  });
});
