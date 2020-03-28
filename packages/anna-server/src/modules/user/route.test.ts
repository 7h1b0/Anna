import request from 'supertest';
import { createUser } from 'factories';
import knex from 'knexClient';
import * as User from 'modules/user/model';
import app from '../..';

const user = createUser();

describe('User API', () => {
  beforeEach(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);
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
            userId: user.userId,
          },
        ]);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBeUnauthorized();
      });
    });
  });

  describe('api/users/id', () => {
    describe('DELETE', () => {
      it('should delete target user when user is authenticated', async () => {
        const response = await request(app)
          .delete(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.status).toHaveStatusOk();
        const users = await knex(User.TABLE).select();
        expect(users).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('PATCH', () => {
      it('should do not update username', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ username: 'test_changed', password: 'anna' });

        expect(response.status).toHaveStatusOk();
        const users = await knex(User.TABLE)
          .first()
          .where('userId', user.userId);

        expect(users).toHaveProperty('username', user.username);
      });

      it('should update password', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ username: 'test', password: 'toto' });

        expect(response.status).toHaveStatusOk();
        const users = await knex(User.TABLE).select();
        expect(users).toHaveLength(1);

        const { password, username, userId, token } = users[0];
        expect(password !== user.password).toBeTruthy();
        expect(userId).toBe(user.userId);
        expect(username).toBe(user.username);
        expect(token).toBe(user.token);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBeUnauthorized();
      });

      it('should retun 400 if body is invalid', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.status).toBeBadRequest();
      });
    });
  });
});
