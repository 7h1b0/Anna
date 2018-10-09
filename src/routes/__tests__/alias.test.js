import request from 'supertest';
import knex from '../../knexClient';
import * as Alias from '../../modules/models/alias';
import * as User from '../../modules/models/user';
import app from '../../index.js';
import dispatch from '../../modules/dispatch';

jest.mock('../../modules/dispatch');

const initAlias = [
  {
    aliasId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
    name: 'test',
    description: 'test',
    enabled: true,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    aliasId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
    name: 'test_2',
    description: 'test',
    enabled: false,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const user = {
  userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
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
            sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
            name: 'test_post',
            description: 'test',
            enabled: false,
          });

        expect(response.status).toBe(201);

        const alias = await knex(Alias.TABLE)
          .first()
          .where('aliasId', response.body);
        expect(alias).toMatchSnapshot({
          aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
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
            sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
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
          .get(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get(`/api/alias/${initAlias[1].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when alias don't exist", async () => {
        const response = await request(app)
          .get('/api/alias/11111111-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });

    describe('PATCH', () => {
      it('should update an alias', async () => {
        const response = await request(app)
          .patch(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
            name: 'test_update',
            description: 'test',
            enabled: true,
          });

        expect(response.status).toBe(204);

        const alias = await knex(Alias.TABLE)
          .first()
          .where('aliasId', 1);

        expect(alias).toMatchSnapshot({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 when request is invalid', async () => {
        const response = await request(app)
          .patch(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
            name: 'test_update',
            description: 'test',
            fake: true,
          });

        expect(response.status).toBe(400);
      });

      it("should retun 404 when alias don't exist", async () => {
        const response = await request(app)
          .patch('/api/alias/11111111-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
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
          .delete(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);

        const alias = await knex(Alias.TABLE)
          .select()
          .where('aliasId', initAlias[0].aliasId);

        expect(alias).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when alias don't exist", async () => {
        const response = await request(app)
          .delete('/api/alias/11111111-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('/api/alias/:id/:enabled', () => {
    it('should enable an alias', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[1].aliasId}/enable`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(204);

      const alias = await knex(Alias.TABLE)
        .first()
        .where('aliasId', initAlias[1].aliasId);

      expect(alias).toMatchSnapshot({
        aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should disable an alias', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[0].aliasId}/disable`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(204);

      const alias = await knex(Alias.TABLE)
        .first()
        .where('aliasId', initAlias[0].aliasId);

      expect(alias).toMatchSnapshot({
        aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[0].aliasId}/disable`)
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
    });

    it("should retun 404 when alias don't exist", async () => {
      const response = await request(app)
        .get('/api/alias/11111111-fd1c-4717-b610-65d2fa3d01b2/disable')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
    });
  });

  describe('/api/alias/:id/action', () => {
    it('should call a scene', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[0].aliasId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(200);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SCENE',
        id: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
      });
    });

    it('should not call a scene if alias is disabled', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[1].aliasId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(403);
      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it("should retun 404 when alias don't exist", async () => {
      const response = await request(app)
        .get('/api/alias/11111111-fd1c-4717-b610-65d2fa3d01b2/action')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
    });
  });
});
