import request from 'supertest';
import createUser from 'createUser';
import knex from '../../knexClient';
import * as User from '../../modules/models/user';
import app from '../../index.js';

const user = createUser();

describe('Log API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/api/log', () => {
    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/log')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake')
        .send();

      expect(response.status).toBeUnauthorized();
    });

    it('should return 200', async () => {
      const response = await request(app)
        .get('/api/log')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send();

      expect(response.status).toHaveStatusOk();
    });
  });

  describe('/api/log/:limit', () => {
    it('should returns 0 log', async () => {
      const response = await request(app)
        .get('/api/log/0')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send();

      expect(response.status).toHaveStatusOk();
      expect(response.body).toEqual([]);
    });

    it('should returns 401 if user is not connected', async () => {
      const response = await request(app)
        .get('/api/log/30')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake')
        .send();

      expect(response.status).toBeUnauthorized();
    });
  });
});
