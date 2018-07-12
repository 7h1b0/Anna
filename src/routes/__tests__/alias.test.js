const request = require('supertest');
const knex = require('../../knexClient');
const Alias = require('../../modules/models/alias');
const User = require('../../modules/models/user');
const app = require('../../index.js');

jest.mock('../../modules/dispatch');
const dispatch = require('../../modules/dispatch');

const initAlias = [
  {
    alias_id: 1,
    scene_id: 1,
    name: 'testone',
    description: 'test',
    enabled: true,
  },
  {
    alias_id: 2,
    scene_id: 1,
    name: 'testtwo',
    description: 'test',
    enabled: false,
  },
];

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

describe('Alias API', () => {
  beforeAll(async () => {
    await knex(Alias.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Alias.TABLE).insert(initAlias);
  });

  afterEach(async () => {
    await knex(Alias.TABLE).truncate();
    dispatch.mockClear();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
    await knex.destroy();
  });

  describe('/api/alias', () => {
    describe('GET', () => {
      it('should retun all alias', async () => {
        const response = await request(app)
          .get('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });

    describe('POST', () => {
      it('should create a new alias', async () => {
        const response = await request(app)
          .post('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 1,
            name: 'test_post',
            description: 'test',
            enabled: false,
          });

        expect(response.status).toBe(201);

        const alias = await knex(Alias.TABLE)
          .select('*')
          .where('alias_id', 3);
        expect(alias[0]).toEqual({
          scene_id: 1,
          alias_id: 3,
          name: 'test_post',
          description: 'test',
          enabled: false,
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 if request is invalid', async () => {
        const response = await request(app)
          .post('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 1,
            name: 'test_post',
            description: 'test',
            fake: false,
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('/api/alias/:id', () => {
    describe('GET', () => {
      it('should retun an alias', async () => {
        const response = await request(app)
          .get('/api/alias/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toEqual({
          aliasId: 1,
          sceneId: 1,
          name: 'testone',
          description: 'test',
          enabled: true,
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/alias/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when alias don't exist", async () => {
        const response = await request(app)
          .get('/api/alias/23')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });

    describe('PATCH', () => {
      it('should update an alias', async () => {
        const response = await request(app)
          .patch('/api/alias/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 2,
            name: 'test_update',
            description: 'test',
            enabled: true,
          });

        expect(response.status).toBe(204);

        const alias = await knex(Alias.TABLE)
          .select('*')
          .where('alias_id', 1);

        expect(alias[0]).toEqual({
          scene_id: 2,
          alias_id: 1,
          name: 'test_update',
          description: 'test',
          enabled: true,
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/alias/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 when request is invalid', async () => {
        const response = await request(app)
          .patch('/api/alias/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 2,
            name: 'test_update',
            description: 'test',
            fake: true,
          });

        expect(response.status).toBe(400);
      });

      it("should retun 404 when alias don't exist", async () => {
        const response = await request(app)
          .patch('/api/alias/23')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 2,
            name: 'test_update',
            description: 'test',
            enabled: true,
          });

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE', () => {
      it('should delete an alias', async () => {
        const response = await request(app)
          .delete('/api/alias/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);

        const alias = await knex(Alias.TABLE)
          .select('*')
          .where('alias_id', 1);

        expect(alias).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete('/api/alias/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when alias don't exist", async () => {
        const response = await request(app)
          .delete('/api/alias/23')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('/api/alias/:id/:enabled', () => {
    it('should enable an alias', async () => {
      const response = await request(app)
        .get('/api/alias/2/enable')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(204);

      const alias = await knex(Alias.TABLE)
        .select('*')
        .where('alias_id', 2);

      expect(alias[0].enabled).toBeTruthy();
    });

    it('should disable an alias', async () => {
      const response = await request(app)
        .get('/api/alias/1/disable')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(204);

      const alias = await knex(Alias.TABLE)
        .select('*')
        .where('alias_id', 1);

      expect(alias[0].enabled).toBeFalsy();
    });

    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/alias/1/disable')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
    });

    it("should retun 404 when alias don't exist", async () => {
      const response = await request(app)
        .delete('/api/alias/23/disable')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
    });
  });

  describe('/api/alias/:name', () => {
    it('should call a scene', async () => {
      const response = await request(app)
        .get('/api/alias/testone')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(200);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SCENE',
        id: 1,
      });
    });

    it('should not call a scene if alias is disabled', async () => {
      const response = await request(app)
        .get('/api/alias/testtwo')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(403);
      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it("should retun 404 when alias don't exist", async () => {
      const response = await request(app)
        .get('/api/alias/testanna')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
    });
  });
});
