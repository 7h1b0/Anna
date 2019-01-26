import request from 'supertest';
import createUser from 'createUser';
import knex from '../../knexClient';
import * as Room from '../../modules/models/room';
import * as User from '../../modules/models/user';
import app from '../../index.js';

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
];

describe('Rooms API', () => {
  beforeAll(async () => {
    await knex(Room.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Room.TABLE).insert(initRooms);
  });

  afterEach(async () => {
    await knex(Room.TABLE).truncate();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
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
          .delete(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();

        const room = await knex(Room.TABLE)
          .select()
          .where('roomId', initRooms[0].roomId);

        expect(room).toHaveLength(0);
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/rooms/${initRooms[0].roomId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it("should retun 404 when a room don't exist", async () => {
        const response = await request(app)
          .delete('/api/rooms/c10c80e8-49e4-4d6b-b966-4fc9fb9887aa')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });
  });
});
