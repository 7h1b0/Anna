import request from 'supertest';
import { createUser } from 'factories';
import knex from '../../knexClient';
import * as User from '../../modules/models/user';
import app from '../../index.js';

import * as Scene from '../../modules/models/scene';
import * as Dio from '../../modules/models/dio';
import * as Room from '../../modules/models/room';
import * as Alias from '../../modules/models/alias';
import * as Routine from '../../modules/models/routine';
import * as hueService from '../../services/hueService';

const user = createUser();

describe('About API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/api', () => {
    it('should returns information about api', async () => {
      jest
        .spyOn(Scene, 'findAll')
        .mockImplementation(() => Promise.resolve([]));

      jest.spyOn(Dio, 'findAll').mockImplementation(() => Promise.resolve([]));
      jest
        .spyOn(Alias, 'findAll')
        .mockImplementation(() => Promise.resolve([]));
      jest.spyOn(Room, 'findAll').mockImplementation(() => Promise.resolve([]));
      jest
        .spyOn(Routine, 'findAll')
        .mockImplementation(() => Promise.resolve([]));
      jest
        .spyOn(hueService, 'getLights')
        .mockImplementation(() => Promise.resolve([]));

      const response = await request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token)
        .send();

      expect(response.status).toHaveStatusOk();
      expect(response.body).toEqual({
        scenes: [],
        dios: [],
        alias: [],
        rooms: [],
        routines: [],
        hueLights: [],
      });
    });

    it('should returns 401 if user is not connected', async () => {
      const response = await request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake')
        .send();

      expect(response.status).toBeUnauthorized();
    });
  });
});
