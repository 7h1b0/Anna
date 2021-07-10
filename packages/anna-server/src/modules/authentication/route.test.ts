import request from 'supertest';
import { createUser } from 'factories';
import knex from '../../knexClient';
import * as User from '../../modules/user/model';
import app from '../..';

const user = createUser();

describe('User API', () => {
  beforeEach(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  describe('/api/register', () => {
    it('should return 400 if the request is malformed', async () => {
      const response = await request(app)
        .post('/api/register')
        .set('Accept', 'application/json')
        .send({ username: 'teste2e' });

      expect(response.status).toBeBadRequest();
    });

    it('should return the new User and create user in database', async () => {
      const response = await request(app)
        .post('/api/register')
        .set('Accept', 'application/json')
        .send({ username: 'teste2e', password: 'anna' });

      expect(response.status).toHaveStatusOk();
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('username', 'teste2e');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');

      const users = await knex(User.TABLE)
        .first()
        .where('userId', response.body.userId);

      expect(users).toHaveProperty('username', response.body.username);
      expect(users).toHaveProperty('token', response.body.token);
      expect(users.password).not.toBe('anna');
    });
  });

  describe('/api/login', () => {
    it('should retun the token', async () => {
      const response = await request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'anna' });

      expect(response.body).toEqual({
        token: user.token,
      });
    });

    it('should return 403 when providing a fake password', async () => {
      const response = await request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'fake' });

      expect(response.status).toBe(403);
    });

    it('should return 403 when providing a fake username', async () => {
      const response = await request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ username: 'fake', password: 'test' });

      expect(response.status).toBe(403);
    });

    it('should return 400 body is invalid', async () => {
      const response = await request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ name: 'fake', password: 'test' });

      expect(response.status).toBeBadRequest();
    });
  });
});
