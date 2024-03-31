import request from 'supertest';
import { uuid } from 'factories';
import knex from '../../knexClient';
import * as hueSensor from '../../modules/hue-sensor/model';
import app from '../../index';

jest.mock('node-fetch', () =>
  jest.fn(() => Promise.resolve({ json: () => ({}) })),
);

const roomId1 = uuid();
const roomId2 = uuid();
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
    await knex(hueSensor.TABLE).truncate();
    await knex(hueSensor.TABLE).insert(hueSensorRooms);
  });

  describe('/api/hue/sensors', () => {
    describe('GET', () => {
      it('should return all lights', async () => {
        const response = await request(app)
          .get('/api/hue/sensors')
          .set('Accept', 'application/json');

        expect(response.status).toHaveStatusOk();
      });
    });

    describe('POST', () => {
      it('should add a sensor into a room', async () => {
        const response = await request(app)
          .post('/api/hue/sensors')
          .set('Accept', 'application/json')
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
          .send(body);

        expect(response.status).toBeBadRequest();
      });
    });
  });
});
