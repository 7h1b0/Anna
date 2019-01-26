import request from 'supertest';
import createUser from 'createUser';
import knex from '../../knexClient';
import * as Alias from '../../modules/models/alias';
import * as User from '../../modules/models/user';
import app from '../../index.js';
import dispatch from '../../modules/dispatch';

jest.mock('../../modules/dispatch');

const user = createUser({ userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f' });
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
    name: 'test_b',
    description: 'test',
    enabled: false,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

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
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
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

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toHaveStatusOk();

        const alias = await knex(Alias.TABLE)
          .first()
          .where('aliasId', response.body);
        expect(alias).toMatchSnapshot({
          aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toBeBadRequest();
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

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toHaveStatusOk();

        const alias = await knex(Alias.TABLE)
          .first()
          .where('aliasId', 1);

        expect(alias).toMatchSnapshot({
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/alias/${initAlias[0].aliasId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toBeBadRequest();
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

        expect(response.status).toHaveStatusOk();

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

        expect(response.status).toBeUnauthorized();
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

      expect(response.status).toHaveStatusOk();

      const alias = await knex(Alias.TABLE)
        .first()
        .where('aliasId', initAlias[1].aliasId);

      expect(alias).toMatchSnapshot({
        aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it('should disable an alias', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[0].aliasId}/disable`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toHaveStatusOk();

      const alias = await knex(Alias.TABLE)
        .first()
        .where('aliasId', initAlias[0].aliasId);

      expect(alias).toMatchSnapshot({
        aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[0].aliasId}/disable`)
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBeUnauthorized();
    });

    it("should retun 404 when alias don't exist", async () => {
      const response = await request(app)
        .get('/api/alias/11111111-fd1c-4717-b610-65d2fa3d01b2/disable')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
    });
  });

  describe('/api/alias/:name/action', () => {
    it('should call a scene', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[0].name}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toHaveStatusOk();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SCENE',
        id: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
      });
    });

    it('should not call a scene if alias is disabled', async () => {
      const response = await request(app)
        .get(`/api/alias/${initAlias[1].name}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(403);
      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it("should retun 404 when alias don't exist", async () => {
      const response = await request(app)
        .get('/api/alias/nop_nop/action')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
    });
  });
});
