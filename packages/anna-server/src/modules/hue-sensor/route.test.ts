import request from 'supertest';
import { createUser } from 'factories';
import knex from 'knexClient';
import * as User from 'modules/user/model';
import * as hueSensor from 'modules/hue-sensor/model';
import app from '../../index';

jest.mock('node-fetch', () =>
  jest.fn(() => Promise.resolve({ json: () => ({}) })),
);

const roomId1 = '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2';
const roomId2 = '0fc1d78e-fd1c-4717-b610-65d2fa3d01b3';
const user = createUser();
const hueSensorRooms = [
  {
    sensorId: '1',
    roomId: roomId1,
  },
  {
    sensorId: '2',
    roomId: roomId2,
  },
];

describe('Hue Sensor API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);

    await knex(hueSensor.TABLE).truncate();
    await knex(hueSensor.TABLE).insert(hueSensorRooms);
  });

  describe('/api/hue/sensors', () => {
    describe('GET', () => {
      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/hue/sensors')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should return all lights', async () => {
        const response = await request(app)
          .get('/api/hue/sensors')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();
      });
    });

    describe('POST', () => {
      it('should add a sensor into a room', async () => {
        const response = await request(app)
          .post('/api/hue/sensors')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sensorId: '3',
            roomId: roomId2,
          });

        expect(response.status).toHaveStatusOk();

        const res = await knex(hueSensor.TABLE)
          .first('roomId')
          .where('sensorId', '3');

        expect(res).toEqual({ roomId: roomId2 });
      });

      it('should update the roomId and the name', async () => {
        const response = await request(app)
          .post('/api/hue/sensors')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sensorId: '2',
            roomId: roomId1,
          });

        expect(response.status).toHaveStatusOk();

        const res = await knex(hueSensor.TABLE)
          .first('roomId')
          .where('sensorId', '2');

        expect(res).toEqual({ roomId: roomId1 });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/hue/sensors')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should retun 400 if body is missing a property', async () => {
        const body = { test: 'test' };

        const response = await request(app)
          .post('/api/hue/sensors')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(body);

        expect(response.status).toBeBadRequest();
      });
    });
  });
});
