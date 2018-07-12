const request = require('supertest');
const knex = require('../../knexClient');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const Scene = require('../../modules/models/scene');
const Dio = require('../../modules/models/dio');
const Room = require('../../modules/models/room');
const Alias = require('../../modules/models/alias');
const scheduleService = require('../../services/scheduleService');

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

describe('About API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
    await knex.destroy();
  });

  describe('/api/about', () => {
    it('should retun 200 when user is authenticated', async () => {
      const response = await request(app)
        .get('/api/about')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send();

      expect(response.status).toBe(200);
    });

    it('should retun an object containing multiple properties', async () => {
      const response = await request(app)
        .get('/api/about')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send();

      const { body } = response;
      expect(body).toHaveProperty('release');
      expect(body).toHaveProperty('hostname');
      expect(body).toHaveProperty('uptime');
      expect(body).toHaveProperty('cpus');
      expect(body).toHaveProperty('loadavg');
      expect(body).toHaveProperty('totalmem');
      expect(body).toHaveProperty('freemem');
      expect(body).toHaveProperty('nodejs');
      expect(body).toHaveProperty('version');
    });

    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/about')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake')
        .send();

      expect(response.status).toBe(401);
    });
  });

  describe('/anna', () => {
    it('should always return 200', async () => {
      const response = await request(app)
        .get('/anna')
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toBe(200);
    });
  });

  describe('/api', () => {
    it('should returns information about api', async () => {
      Scene.findAll = jest.fn(() => Promise.resolve('scenes'));
      Dio.findAll = jest.fn(() => Promise.resolve('dios'));
      Alias.findAll = jest.fn(() => Promise.resolve('alias'));
      Room.findAll = jest.fn(() => Promise.resolve('rooms'));
      scheduleService.getAll = jest.fn(() => 'schedules');

      const response = await request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        scenes: 'scenes',
        dios: 'dios',
        alias: 'alias',
        rooms: 'rooms',
        schedules: 'schedules',
      });
    });

    it('should returns 401 if user is not connected', async () => {
      const response = await request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake')
        .send();

      expect(response.status).toBe(401);
    });
  });
});
