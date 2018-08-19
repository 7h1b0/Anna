import request from 'supertest';
import knex from '../../knexClient';
import * as User from '../../modules/models/user';
import app from '../../index.js';

import * as Scene from '../../modules/models/scene';
import * as Dio from '../../modules/models/dio';
import * as Room from '../../modules/models/room';
import * as Alias from '../../modules/models/alias';
import scheduleService from '../../services/scheduleService';

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
