import request from 'supertest';
import { createUser } from 'factories';
import knex from '../../knexClient';
import * as Room from '../../modules/room/model';
import * as User from '../../modules/user/model';
import * as Dio from '../../modules/dio/model';
import app from '../../index';
import * as hueService from '../../services/hueService';

const user = createUser({ userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f' });
const initRooms = [
  {
    roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    description: 'this is a test',
    name: 'room_1',
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    roomId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    description: 'this is a second test',
    name: 'room_2',
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    roomId: 'd10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    description: 'this is a second test',
    name: 'room_3',
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];
const initDios = [
  {
    dioId: 1,
    roomId: initRooms[0].roomId,
    name: 'test_1',
  },
  {
    dioId: 2,
    roomId: initRooms[0].roomId,
    name: 'test_2',
  },
  {
    dioId: 3,
    roomId: initRooms[1].roomId,
    name: 'test_3',
  },
];

describe('Rooms API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);

    await knex(Dio.TABLE).truncate();
    await knex(Dio.TABLE).insert(initDios);
  });

  beforeEach(async () => {
    await knex(Room.TABLE).truncate();
    await knex(Room.TABLE).insert(initRooms);
  });

  describe('/api/rooms', () => {
    describe('GET', () => {
      it('should return all rooms', async () => {
        const response = await request(app)
          .get('/api/rooms')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/rooms')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('POST', () => {
      it('should create a new room', async () => {
        const response = await request(app)
          .post('/api/rooms')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            name: 'Living Room',
            description: 'a description',
          });

        expect(response.status).toHaveStatusOk();

        const rooms = await knex(Room.TABLE)
          .first()
          .where('roomId', response.body);

        expect(rooms).toMatchSnapshot({
          roomId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        });
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/rooms')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should retun 400 if request is invalid', async () => {
        const response = await request(app)
          .post('/api/rooms')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            description: 'missing name',
          });

        expect(response.status).toBeBadRequest();
      });
    });
  });

  describe('/api/rooms/:id', () => {
    let mockGetLights: jest.SpyInstance<Promise<hueService.HueLight[]>, []>;
    let mockGetSensors: jest.SpyInstance<
      Promise<hueService.TemperatureSensor[]>,
      [string]
    >;
    beforeAll(() => {
      mockGetLights = jest.spyOn(hueService, 'getLights').mockResolvedValue([
        {
          id: '1',
          roomId: initRooms[0].roomId,
          name: 'light_1',
          type: 'Dimmable light',
          state: {
            on: true,
            bri: 1,
            reachable: true,
          },
        },
        {
          id: '2',
          roomId: initRooms[0].roomId,
          name: 'light_2',
          type: 'Dimmable light',
          state: {
            on: true,
            bri: 1,
            reachable: true,
          },
        },
        {
          id: '3',
          roomId: initRooms[1].roomId,
          name: 'light_3',
          type: 'Dimmable light',
          state: {
            on: true,
            bri: 1,
            reachable: true,
          },
        },
      ]);
      mockGetSensors = jest
        .spyOn(hueService, 'getSensorsByRoomId')
        .mockResolvedValue([
          {
            id: '10',
            state: {
              temperature: 20,
              lastupdated: '2020-05-09T19:10:00',
            },
            type: 'ZLLTemperature',
          },
        ]);
    });

    afterEach(() => {
      mockGetLights.mockClear();
      mockGetSensors.mockClear();
    });

    describe('GET', () => {
      it('should return an room', async () => {
        const response = await request(app)
          .get(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it("should retun 404 when a room don't exist", async () => {
        const response = await request(app)
          .get('/api/rooms/c10c80e8-49e4-4d6b-b966-4fc9fb9887aa')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });

    describe('PATCH', () => {
      it('should update an room', async () => {
        const response = await request(app)
          .patch(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            description: 'this is a second test',
            name: 'room_updated',
          });

        expect(response.status).toHaveStatusOk();

        const room = await knex(Room.TABLE)
          .first()
          .where('roomId', initRooms[0].roomId);

        expect(room).toMatchSnapshot({
          roomId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        });
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should return 400 when request is invalid', async () => {
        const response = await request(app)
          .patch(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            name: 'test_update',
            fake: true,
          });

        expect(response.status).toBeBadRequest();
      });

      it("should retun 404 when a room don't exist", async () => {
        const response = await request(app)
          .patch('/api/rooms/c10c80e8-49e4-4d6b-b966-4fc9fb9887aa')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            description: 'this is a second test',
            name: 'room_updated',
          });

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE', () => {
      it('should delete an room', async () => {
        const response = await request(app)
          .delete(`/api/rooms/${initRooms[2].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();

        const room = await knex(Room.TABLE)
          .select()
          .where('roomId', initRooms[2].roomId);

        expect(room).toHaveLength(0);
      });

      it('should return 403 when room is used', async () => {
        const response = await request(app)
          .delete(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(403);
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it("should retun 403 when a room don't exist", async () => {
        const response = await request(app)
          .delete('/api/rooms/c10c80e8-49e4-4d6b-b966-4fc9fb9887aa')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(403);
      });
    });
  });
});
