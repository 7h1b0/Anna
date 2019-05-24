import request from 'supertest';
import { createUser } from 'factories';
import knex from '../../knexClient';
import * as User from '../../modules/models/user';
import * as hueLight from '../../modules/models/hueLight';
import app from '../../index';
import fetch from 'node-fetch';

jest.mock('node-fetch');

const user = createUser();
const hueLightRooms = [
  {
    lightId: 1,
    roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
  },
  {
    lightId: 2,
    roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
  },
];

describe('Hue Light API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).insert(user);
    await knex(hueLight.TABLE).insert(hueLightRooms);
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(hueLight.TABLE).truncate();
  });

  describe('/api/hue/lights', () => {
    describe('GET', () => {
      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/hue/lights')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should return all lights', async () => {
        const response = await request(app)
          .get('/api/hue/lights')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();
      });
    });
  });

  describe('api/hue/lights/:id_light', () => {
    describe('GET', () => {
      it('should return a light', async () => {
        const response = await request(app)
          .get('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('PATCH', () => {
      it('should update the name of the light', async () => {
        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ name: 'test' });

        expect(response.status).toHaveStatusOk();
        expect(fetch).toHaveBeenCalledWith(
          'http://testIP/api/abcdefghijklmnopqrstuvwxywz/lights/2',
          { body: JSON.stringify({ name: 'test' }), method: 'put' },
        );
      });

      it('should update the roomId and the name', async () => {
        const updatedName = {
          roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'test_room',
        };

        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedName);

        expect(response.status).toHaveStatusOk();
        expect(fetch).toHaveBeenCalledWith(
          'http://testIP/api/abcdefghijklmnopqrstuvwxywz/lights/2',
          { body: JSON.stringify({ name: 'test_room' }), method: 'put' },
        );

        const res = await knex(hueLight.TABLE)
          .first('roomId')
          .where('lightId', 2);

        expect(res).toEqual({ roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b3' });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should retun 400 if name is missing', async () => {
        const updatedName = { test: 'test' };

        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedName);

        expect(response.status).toBeBadRequest();
      });
    });

    describe('POST', () => {
      it('should add light to a room', async () => {
        const response = await request(app)
          .post('/api/hue/lights/3')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ roomId: '0a80e3de-245a-4983-9b8f-67f37ceff94b' });

        expect(response.status).toHaveStatusOk();
        const res = await knex(hueLight.TABLE)
          .first('roomId')
          .where('lightId', 3);

        expect(res).toEqual({ roomId: '0a80e3de-245a-4983-9b8f-67f37ceff94b' });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/hue/lights/3')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should retun 400 if name is missing', async () => {
        const response = await request(app)
          .post('/api/hue/lights/3')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ empty: '' });

        expect(response.status).toBeBadRequest();
      });
    });
  });

  describe('api/hue/lights/:id_light/:status', () => {
    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/hue/lights/2/on')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBeUnauthorized();
    });

    it('should call fetch with on to true', async () => {
      const response = await request(app)
        .get('/api/hue/lights/2/on')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toHaveStatusOk();
      expect(fetch).toHaveBeenCalledWith(
        'http://testIP/api/abcdefghijklmnopqrstuvwxywz/lights/2/state',
        { body: JSON.stringify({ on: true }), method: 'put' },
      );
    });

    it('should call fetch with on to false', async () => {
      const response = await request(app)
        .get('/api/hue/lights/2/off')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toHaveStatusOk();
      expect(fetch).toHaveBeenCalledWith(
        'http://testIP/api/abcdefghijklmnopqrstuvwxywz/lights/2/state',
        { body: JSON.stringify({ on: false }), method: 'put' },
      );
    });
  });

  describe('api/hue/lights/:id_light/state', () => {
    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBeUnauthorized();
    });

    it('should return 400 when body is invalid', async () => {
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send({});

      expect(response.status).toBeBadRequest();
    });

    it('should return 400 when body is invalid', async () => {
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send({ test: true });

      expect(response.status).toBeBadRequest();
    });

    it('should call fetch with body passed', async () => {
      const body = { on: true, bri: 25, sat: 200, xy: [23, 45] };
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send(body);

      expect(response.status).toHaveStatusOk();
      expect(fetch).toHaveBeenCalledWith(
        'http://testIP/api/abcdefghijklmnopqrstuvwxywz/lights/2/state',
        { body: JSON.stringify(body), method: 'put' },
      );
    });
  });
});
