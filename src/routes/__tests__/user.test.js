const request = require('supertest');
const knex = require('../../knexClient');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

describe('User API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(User.TABLE).insert(user);
  });

  afterEach(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/login', () => {
    it('should retun the token', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'anna' });

      expect(response.body).toEqual({
        username: user.username,
        token: user.token,
      });
    });

    it('should return 403 when providing a fake password', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'fake' });

      expect(response.status).toBe(403);
    });

    it('should return 403 when providing a fake username', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'fake', password: 'test' });

      expect(response.status).toBe(403);
    });
  });

  describe('api/users', () => {
    describe('GET', () => {
      it('should retun 200 when user is authenticated', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.body).toEqual([
          {
            username: user.username,
            userId: user.user_id,
          },
        ]);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBe(401);
      });
    });
  });

  describe('api/users/id', () => {
    describe('DELETE', () => {
      it('should delete target user when user is authenticated', async () => {
        const response = await request(app)
          .delete('/api/users/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.status).toBe(204);
        const users = await knex(User.TABLE).select('*');
        expect(users).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete('/api/users/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBe(401);
      });
    });

    describe('PATCH', () => {
      it.skip('should do not update username', async () => {
        const response = await request(app)
          .patch('/api/users/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ username: 'test_changed', password: 'anna' });

        expect(response.status).toBe(204);
        const users = await knex(User.TABLE).select('*');

        expect(users).toContainEqual({
          user_id: user.user_id,
          username: user.username,
          password: user.password,
          token: user.token,
        });
      });

      it('should update password', async () => {
        const response = await request(app)
          .patch('/api/users/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ username: 'test', password: 'toto' });

        expect(response.status).toBe(204);
        const users = await knex(User.TABLE).select('*');
        expect(users).toHaveLength(1);

        const { password, username, user_id, token } = users[0];
        expect(password !== user.password).toBeTruthy();
        expect(user_id).toBe(user.user_id);
        expect(username).toBe(user.username);
        expect(token).toBe(user.token);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/users/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBe(401);
      });

      it('should retun 400 if body is invalid', async () => {
        const response = await request(app)
          .patch('/api/users/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.status).toBe(400);
      });
    });
  });
});
