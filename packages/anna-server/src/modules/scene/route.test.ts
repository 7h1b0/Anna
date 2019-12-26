import request from 'supertest';
import { createUser } from 'factories';
import knex from 'knexClient';
import * as Scene from 'modules/scene/model';
import * as Action from 'modules/scene/action';
import * as User from 'modules/user/model';
import app from '../../index';
import dispatch from 'utils/dispatch';

jest.mock('utils/dispatch');

const user = createUser({ userId: '29699398-449c-48fb-8f5c-84186cdf8279' });
const initScenes = [
  {
    sceneId: '05442486-0878-440c-9db1-a7006c25a39f',
    description: 'this is a test',
    name: 'scene_1',
    createdBy: '29699398-449c-48fb-8f5c-84186cdf8279',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    sceneId: '18feb598-32cb-472f-8b29-a7e7fe41e06b',
    description: 'this is a second test',
    name: 'scene_2',
    createdBy: '29699398-449c-48fb-8f5c-84186cdf8279',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const initActions = [
  {
    actionId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '05442486-0878-440c-9db1-a7006c25a39f',
    type: 'DIO',
    name: 'action turn on',
    targetId: 1,
    body: JSON.stringify({ on: true }),
  },
  {
    actionId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '05442486-0878-440c-9db1-a7006c25a39f',
    type: 'DIO',
    name: 'action turn off',
    targetId: 2,
    body: JSON.stringify({ on: false }),
  },
  {
    actionId: '2fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '18feb598-32cb-472f-8b29-a7e7fe41e06b',
    type: 'HUE_LIGHT',
    name: 'call scene',
    targetId: 1,
    body: null,
  },
];

describe('Scene API', () => {
  beforeAll(async () => {
    await knex(Scene.TABLE).truncate();
    await knex(Action.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Action.TABLE).insert(initActions);
    await knex(Scene.TABLE).insert(initScenes);
  });

  afterEach(async () => {
    await knex(Scene.TABLE).truncate();
    await knex(Action.TABLE).truncate();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/api/scenes', () => {
    describe('GET', () => {
      it('should retun all scene', async () => {
        const response = await request(app)
          .get('/api/scenes')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/scenes')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('POST', () => {
      it('should return 400 if scene is malformed', async () => {
        const scene = {
          description: 'this is a test scene',
          actions: [
            {
              targetId: 2,
              name: 'action',
              type: 'DIO',
              body: {
                on: true,
              },
            },
          ],
        };

        const response = await request(app)
          .post('/api/scenes')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(scene);

        expect(response.status).toBeBadRequest();
      });

      it('should create a scene', async () => {
        const scene = {
          name: 'testScene',
          description: 'this is a test scene',
          actions: [
            {
              targetId: 1,
              name: 'action',
              type: 'DIO',
              body: {
                on: true,
              },
            },
          ],
        };

        const response = await request(app)
          .post('/api/scenes')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(scene);

        expect(response.status).toHaveStatusOk();

        const sceneFromDatabase = await knex(Scene.TABLE)
          .first()
          .where('sceneId', response.body.sceneId);

        expect(sceneFromDatabase).toMatchSnapshot({
          sceneId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        });

        const actions = await knex(Action.TABLE)
          .select()
          .where('sceneId', response.body.sceneId);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toMatchSnapshot({
          actionId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          sceneId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/scenes')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });
    });
  });

  describe('/api/scenes/:id', () => {
    describe('GET', () => {
      it('should retun a scene', async () => {
        const response = await request(app)
          .get(`/api/scenes/${initScenes[0].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();
        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get(`/api/scenes/${initScenes[1].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it("should retun 404 when a scene don't exist", async () => {
        const response = await request(app)
          .get('/api/scenes/3fc1d78e-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE', () => {
      it('should delete a scene and all associated actions', async () => {
        const response = await request(app)
          .delete(`/api/scenes/${initScenes[0].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();

        const scene = await knex(Scene.TABLE)
          .select()
          .where('sceneId', initScenes[0].sceneId);

        expect(scene).toHaveLength(0);

        const actions = await knex(Action.TABLE)
          .select()
          .where('sceneId', initScenes[0].sceneId);

        expect(actions).toHaveLength(0);
      });

      it('should return 404 if scene is not found', async () => {
        const response = await request(app)
          .delete('/api/scenes/5fc1d78e-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/scenes/${initScenes[1].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('PATCH', () => {
      it('should return 400 if scene is malformed', async () => {
        const scene = {
          description: 'this is an updated scene',
          actions: [
            {
              targetId: 2,
              name: 'action',
              type: 'DIO',
              body: {
                on: true,
              },
            },
          ],
        };

        const response = await request(app)
          .patch(`/api/scenes/${initScenes[1].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(scene);

        expect(response.status).toBeBadRequest();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/scenes/${initScenes[1].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });

      it('should return 404 if scene is not found', async () => {
        const scene = {
          description: 'this is an updated scene',
          name: 'testtest',
          actions: [
            {
              targetId: 2,
              name: 'action',
              type: 'DIO',
              body: {
                on: true,
              },
            },
          ],
        };
        const response = await request(app)
          .patch('/api/scenes/faaed78e-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(scene);

        expect(response.status).toBe(404);
      });

      it('should update a scene', async () => {
        const updatedScene = {
          description: 'this is an updated test',
          name: 'scene_2',
          actions: [
            {
              type: 'HUE_LIGHT',
              name: 'call scene',
              targetId: 3,
              body: { on: true },
            },
          ],
        };

        const response = await request(app)
          .patch(`/api/scenes/${initScenes[1].sceneId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedScene);

        expect(response.status).toHaveStatusOk();

        const sceneFromDatabase = await knex(Scene.TABLE)
          .first()
          .where('sceneId', initScenes[1].sceneId);

        expect(sceneFromDatabase).toMatchSnapshot({
          sceneId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        });
      });
    });
  });

  describe('/api/scenes/:id_scene/action', () => {
    it('should call dispatch', async () => {
      const response = await request(app)
        .get(`/api/scenes/${initScenes[1].sceneId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toHaveStatusOk();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SCENE',
        targetId: initScenes[1].sceneId,
      });
    });

    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get(`/api/scenes/${initScenes[0].sceneId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBeUnauthorized();
    });
  });
});