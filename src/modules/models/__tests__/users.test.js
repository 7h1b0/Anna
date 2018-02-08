const knex = require('../../../../knexClient');
const User = require('../user');
const initUsers = [
  {
    user_id: 1,
    username: 'one',
    password: 'test',
    token: 'token_one',
  },
  {
    user_id: 2,
    username: 'two',
    password: 'test',
    token: 'token_two',
  },
];

beforeAll(async () => {
  await knex(User.TABLE).truncate();
});

describe('Users', () => {
  beforeEach(async () => {
    await knex(User.TABLE).insert(initUsers);
  });

  afterEach(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await User.findAll();
      expect(result).toMatchSnapshot();
    });
  });

  describe('findByUsername', () => {
    it('should return only one user', async () => {
      const expected = {
        userId: 1,
        username: 'one',
        password: 'test',
        token: 'token_one',
      };

      const result = await User.findByUsername('one');
      expect(result).toEqual(expected);
    });

    it('should return undefined', async () => {
      const result = await User.findByUsername('no');
      expect(result).toBe(undefined);
    });
  });

  describe('findByToken', () => {
    it('should return only one user', async () => {
      const expected = {
        userId: 1,
        username: 'one',
      };

      const result = await User.findByToken('token_one');
      expect(result).toEqual(expected);
    });

    it('should return undefined', async () => {
      const result = await User.findByToken('no');
      expect(result).toBe(undefined);
    });
  });

  //FIXME: Add tests
});
