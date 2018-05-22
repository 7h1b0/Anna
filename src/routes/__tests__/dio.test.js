const request = require('supertest');
const knex = require('../../knexClient');
const Dio = require('../../modules/models/dio');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const initDios = [
  {
    dio_id: 1,
    room_id: 1,
    name: 'test',
  },
  {
    dio_id: 2,
    room_id: 2,
    name: 'test',
  },
];

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

describe('Dio API', () => {
  beforeAll(async () => {
    await knex(Dio.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Dio.TABLE).insert(initDios);
  });

  afterEach(async () => {
    await knex(Dio.TABLE).truncate();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/api/dios', () => {
    describe('GET', () => {
      it('should retun all dio', async () => {
        const response = await request(app)
          .get('/api/dios')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/dios')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });

    describe('POST', () => {
      it('should create a new dio', async () => {
        const response = await request(app)
          .post('/api/dios')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            dioId: 3,
            name: 'test_post',
            roomId: 1,
          });

        expect(response.status).toBe(201);

        const dio = await knex(Dio.TABLE)
          .select('*')
          .where('dio_id', 3);
        expect(dio[0]).toEqual({
          dio_id: 3,
          name: 'test_post',
          room_id: 1,
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/dios')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 if request is invalid', async () => {
        const response = await request(app)
          .post('/api/dios')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            dioId: 1,
            name: 'test_post',
            roomId: 1,
            admin: true,
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('/api/dios/:id', () => {
    describe('GET', () => {
      it('should retun a dio', async () => {
        const response = await request(app)
          .get('/api/dios/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toEqual({
          dioId: 1,
          name: initDios[0].name,
          roomId: initDios[0].room_id,
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/dios/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });

    describe('PATCH', () => {
      it('should update a dio', async () => {
        const response = await request(app)
          .patch('/api/dios/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            dioId: 1,
            name: 'test_updated',
            roomId: 1,
          });

        expect(response.status).toBe(204);

        const dio = await knex(Dio.TABLE)
          .select('*')
          .where('room_id', 1);

        expect(dio[0]).toEqual({
          dio_id: 1,
          name: 'test_updated',
          room_id: 1,
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/dios/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 when request is invalid', async () => {
        const response = await request(app)
          .patch('/api/dios/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            dioId: 1,
            name: 'test_post',
            roomId: 1,
            admin: true,
          });

        expect(response.status).toBe(400);
      });
    });

    describe('DELETE', () => {
      it('should delete a dio', async () => {
        const response = await request(app)
          .delete('/api/dios/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);

        const dio = await knex(Dio.TABLE)
          .select('*')
          .where('room_id', 1);

        expect(dio).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete('/api/dios/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });
  });

  describe('api/dios/:id/:status', () => {
    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .patch('/api/dios/1/on')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
    });
  });
});
