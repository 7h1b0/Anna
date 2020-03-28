import knex from '../../knexClient';
import * as User from './model';
const initUsers = [
  {
    userId: '010c80e8-49e4-4d6b-b966-4fc9fb98879f',
    username: 'one',
    password: 'test',
    token: 'token_one',
  },
  {
    userId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    username: 'two',
    password: 'test',
    token: 'token_two',
  },
];

describe('Users', () => {
  beforeEach(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(initUsers);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await User.findAll();
      expect(result).toMatchSnapshot();
    });
  });

  describe('findByUsername', () => {
    it('should return only one user', async () => {
      const result = await User.findByUsername(initUsers[0].username);
      expect(result).toEqual(initUsers[0]);
    });

    it('should return undefined', async () => {
      const result = await User.findByUsername('no');
      expect(result).toBeUndefined();
    });
  });

  describe('findByToken', () => {
    it('should return only one user', async () => {
      const result = await User.findByToken(initUsers[0].token);
      expect(result).toEqual({
        userId: initUsers[0].userId,
        username: initUsers[0].username,
      });
    });

    it('should return undefined', async () => {
      const result = await User.findByToken('no');
      expect(result).toBeUndefined();
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update an user safely', async () => {
      const rowsAffected = await User.findByIdAndUpdate(initUsers[0].userId, {
        username: 'username',
      });
      expect(rowsAffected).toBe(1);
      const user = await knex(User.TABLE).select();
      expect(user).toMatchSnapshot();
    });

    it('should not update an user if userId is unknow', async () => {
      const rowsAffected = await User.findByIdAndUpdate('-1', {
        username: 'username',
      });
      expect(rowsAffected).toBe(0);
      const user = await knex(User.TABLE).select();
      expect(user).toEqual(initUsers);
    });
  });

  describe('save', () => {
    it('should save a new user', async () => {
      const save = {
        username: 'testsave',
        password: 'sdfsdfsdfsdfsdf',
        token: 'fghjkhjkhjhk',
      };

      const userId = await User.save(save);
      const user = await knex(User.TABLE).first().where('userId', userId);

      expect(user).toMatchSnapshot({
        userId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
      });
    });
  });

  describe('delete', () => {
    it('should delete an user', async () => {
      await User.remove(initUsers[0].userId);
      const users = await knex(User.TABLE).select();
      expect(users).toEqual([initUsers[1]]);
    });

    it('should not delete an user', async () => {
      await User.remove('-1');
      const users = await knex(User.TABLE).select();
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
