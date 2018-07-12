const request = require('supertest');
const knex = require('../../knexClient');
const Room = require('../../modules/models/room');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const initRooms = [
  {
    room_id: 1,
    description: 'this is a test',
    name: 'room_1',
  },
  {
    room_id: 2,
    description: 'this is a second test',
    name: 'room_2',
  },
];

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

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
    await knex.destroy();
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

        expect(response.status).toBe(401);
      });
    });
  });

  describe('/api/rooms/:id', () => {
    describe('GET', () => {
      it('should return an room', async () => {
        const response = await request(app)
          .get('/api/rooms/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toEqual({
          roomId: 1,
          description: 'this is a test',
          name: 'room_1',
        });
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/rooms/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when a room don't exist", async () => {
        const response = await request(app)
          .get('/api/rooms/23')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });

    describe('PATCH', () => {
      it('should update an room', async () => {
        const response = await request(app)
          .patch('/api/rooms/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            description: 'this is a second test',
            name: 'room_updated',
          });

        expect(response.status).toBe(204);

        const room = await knex(Room.TABLE)
          .select('*')
          .where('room_id', 1);

        expect(room[0]).toEqual({
          description: 'this is a second test',
          name: 'room_updated',
          room_id: 1,
        });
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/rooms/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should return 400 when request is invalid', async () => {
        const response = await request(app)
          .patch('/api/rooms/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            name: 'test_update',
            fake: true,
          });

        expect(response.status).toBe(400);
      });

      it("should retun 404 when a room don't exist", async () => {
        const response = await request(app)
          .patch('/api/rooms/23')
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
          .delete('/api/rooms/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);

        const room = await knex(Room.TABLE)
          .select('*')
          .where('room_id', 1);

        expect(room).toHaveLength(0);
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete('/api/rooms/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when a room don't exist", async () => {
        const response = await request(app)
          .delete('/api/rooms/23')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });
  });
});
