import request from 'supertest';
import knex from '../../knexClient';
import * as Scene from '../../modules/models/scene';
import * as Action from '../../modules/models/action';
import * as User from '../../modules/models/user';
import app from '../../index.js';
import dispatch from '../../modules/dispatch';

jest.mock('../../modules/dispatch');

const initScenes = [
  {
    sceneId: 1,
    description: 'this is a test',
    name: 'scene_1',
    createdBy: 1,
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    sceneId: 2,
    description: 'this is a second test',
    name: 'scene_2',
    createdBy: 1,
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const initActions = [
  {
    actionId: 1,
    sceneId: 1,
    type: 'DIO',
    name: 'action turn on',
    targetId: 1,
    body: JSON.stringify({ on: true }),
  },
  {
    actionId: 2,
    sceneId: 1,
    type: 'DIO',
    name: 'action turn off',
    targetId: 2,
    body: JSON.stringify({ on: false }),
  },
  {
    actionId: 3,
    sceneId: 2,
    type: 'SCENE',
    name: 'call scene',
    targetId: 2,
    body: null,
  },
];

const user = {
  userId: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

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
    dispatch.mockClear();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
    await knex.destroy();
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

        expect(response.status).toBe(401);
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

        expect(response.status).toBe(400);
      });

      it('should create a scene', async () => {
        const scene = {
          name: 'testScene',
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

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('sceneId', 3);

        const sceneFromDatabase = await knex(Scene.TABLE)
          .first('*')
          .where('sceneId', 3);

        expect(sceneFromDatabase).toMatchSnapshot({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

        const actions = await knex(Action.TABLE)
          .select('*')
          .where('sceneId', 3);

        expect(actions).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/scenes')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });
  });

  describe('/api/scenes/:id', () => {
    describe('GET', () => {
      it('should retun a scene', async () => {
        const response = await request(app)
          .get('/api/scenes/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/scenes/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it("should retun 404 when a scene don't exist", async () => {
        const response = await request(app)
          .get('/api/scenes/23')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE', () => {
      it('should delete a scene and all associated actions', async () => {
        const response = await request(app)
          .delete('/api/scenes/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);

        const scene = await knex(Scene.TABLE)
          .select('*')
          .where('sceneId', 1);

        expect(scene).toHaveLength(0);

        const actions = await knex(Action.TABLE)
          .select('*')
          .where('sceneId', 1);

        expect(actions).toHaveLength(0);
      });

      it('should return 404 if scene is not found', async () => {
        const response = await request(app)
          .delete('/api/scenes/6')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete('/api/scenes/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
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
          .patch('/api/scenes/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(scene);

        expect(response.status).toBe(400);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch('/api/scenes/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
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
          .patch('/api/scenes/6')
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
              actionId: 3,
              type: 'SCENE',
              name: 'call scene',
              targetId: 2,
              body: { on: true },
            },
          ],
        };

        const response = await request(app)
          .patch('/api/scenes/2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(updatedScene);

        expect(response.status).toBe(204);

        const sceneFromDatabase = await knex(Scene.TABLE)
          .first('*')
          .where('sceneId', 2);
        expect(sceneFromDatabase).toMatchSnapshot({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });
    });
  });

  describe('/api/scenes/:id_scene/action', () => {
    it('should call dispatch', async () => {
      const response = await request(app)
        .get('/api/scenes/1/action')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(200);
      expect(dispatch).toHaveBeenCalledWith({ type: 'SCENE', id: '1' });
    });

    it('should retun 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/scenes/1/action')
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
    });
  });
});
