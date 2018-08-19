const knex = require('../../../knexClient');
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

describe('Users', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
  });

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

  describe('findByIdAndUpdate', () => {
    it('should updat an user', async () => {
      const rowsAffected = await User.findByIdAndUpdate(1, {
        username: 'username',
      });
      expect(rowsAffected).toBe(1);
      const user = await knex(User.TABLE).select('*');
      expect(user).toMatchSnapshot();
    });

    it('should update an user', async () => {
      const rowsAffected = await User.findByIdAndUpdate(-1, {
        username: 'username',
      });
      expect(rowsAffected).toBe(0);
      const user = await knex(User.TABLE).select('*');
      expect(user).toEqual(initUsers);
    });

    xit('should reject when an username is already taken', async () => {
      await expect(
        User.findByIdAndUpdate(2, { username: 'one' }),
      ).rejects.toBeDefined();
    });
  });

  describe('save', () => {
    it('should save a new user', async () => {
      const save = {
        username: 'testsave',
        password: 'sdfsdfsdfsdfsdf',
        token: 'fghjkhjkhjhk',
      };

      await User.save(save);
      const user = await knex(User.TABLE)
        .select('*')
        .where('username', 'testsave');
      expect(user).toMatchSnapshot();
    });

    xit('should reject when an username is already taken', async () => {
      const save = {
        username: 'one',
        password: 'sdfsdfsdfsdfsdf',
        token: 'fghjkhjkhjhk',
      };

      await expect(User.save(save)).rejects.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete an user', async () => {
      await User.delete(1);
      const users = await knex(User.TABLE).select('*');
      expect(users).toMatchSnapshot();
    });

    it('should not delete an user', async () => {
      await User.delete(-1);
      const users = await knex(User.TABLE).select('*');
      expect(users).toEqual(initUsers);
    });
  });

  describe('validate', () => {
    it('should return true when an user is valid', () => {
      const user = {
        username: 'test',
        password: 'myPassword',
      };

      expect(User.validate(user)).toBeTruthy();
    });

    it('should return false when an user is missing a props', () => {
      const user = {
        username: 'test',
      };

      expect(User.validate(user)).toBeFalsy();
    });

    it('should return false when an user has unknow props', () => {
      const user = {
        username: 'test',
        password: 'myPassword',
        test: 2,
      };

      expect(User.validate(user)).toBeFalsy();
    });

    it('should return false username is incorrect', () => {
      const user = {
        username: 1,
        description: 'testtest',
      };

      expect(User.validate(user)).toBeFalsy();
    });

    it('should return false password is too small', () => {
      const user = {
        username: 'test',
        description: 'q',
      };

      expect(User.validate(user)).toBeFalsy();
    });
  });
});
