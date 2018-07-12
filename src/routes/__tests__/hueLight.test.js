const request = require('supertest');
const knex = require('../../knexClient');
const User = require('../../modules/models/user');
const hueLight = require('../../modules/models/hueLight');
const app = require('../../index.js');

jest.mock('../../services/requestService');
const requestService = require('../../services/requestService');

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

const hueLightRooms = [
  {
    light_id: 1,
    room_id: 1,
  },
  {
    light_id: 2,
    room_id: 1,
  },
];

describe('Hue Light API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).insert(user);
    await knex(hueLight.TABLE).insert(hueLightRooms);
  });

  afterEach(() => {
    requestService.put.mockClear();
    requestService.get.mockClear();
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

        expect(response.status).toBe(401);
      });

      it('should return all lights', async () => {
        const response = await request(app)
          .get('/api/hue/lights')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
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

        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });

    describe('PATCH', () => {
      it('should update the name of the light', async () => {
        const updatedName = { name: 'test' };

        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedName);

        expect(response.status).toBe(200);
        expect(requestService.put).toHaveBeenCalledTimes(1);
        expect(requestService.put.mock.calls[0][1]).toEqual(updatedName);
      });

      it('should update the roomId and the name', async () => {
        const updatedName = { roomId: 2, name: 'test_room' };

        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedName);

        expect(response.status).toBe(200);
        expect(requestService.put).toHaveBeenCalledTimes(1);
        expect(requestService.put.mock.calls[0][1]).toEqual({
          name: 'test_room',
        });

        const res = await knex(hueLight.TABLE)
          .select('room_id')
          .where('light_id', 2);

        expect(res).toEqual([{ room_id: 2 }]);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 if name is missing', async () => {
        const updatedName = { test: 'test' };

        const response = await request(app)
          .patch('/api/hue/lights/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedName);

        expect(response.status).toBe(400);
      });
    });
  });

  describe('api/hue/lights/:id_light/:status', () => {
    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/hue/lights/2/on')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
    });

    it('should call requestService with on to true', async () => {
      const response = await request(app)
        .get('/api/hue/lights/2/on')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(200);
      expect(requestService.put).toHaveBeenCalledTimes(1);
      expect(requestService.put.mock.calls[0][1]).toEqual({ on: true });
      expect(requestService.put.mock.calls[0][0]).toMatch(/lights\/2\/state$/);
    });

    it('should call requestService with on to false', async () => {
      const response = await request(app)
        .get('/api/hue/lights/2/off')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(200);
      expect(requestService.put).toHaveBeenCalledTimes(1);
      expect(requestService.put.mock.calls[0][1]).toEqual({ on: false });
      expect(requestService.put.mock.calls[0][0]).toMatch(/lights\/2\/state$/);
    });
  });

  describe('api/hue/lights/:id_light/state', () => {
    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
    });

    it('should return 400 when body is invalid', async () => {
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 when body is invalid', async () => {
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send({ test: true });

      expect(response.status).toBe(400);
    });

    it('should call requestService with body passed', async () => {
      const body = { sat: 200, bri: 25, on: true, xy: [23, 45] };
      const response = await request(app)
        .patch('/api/hue/lights/2/state')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send(body);

      expect(response.status).toBe(200);
      expect(requestService.put).toHaveBeenCalledTimes(1);
      expect(requestService.put.mock.calls[0][1]).toEqual(body);
      expect(requestService.put.mock.calls[0][0]).toMatch(/lights\/2\/state$/);
    });
  });
});
