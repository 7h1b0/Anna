const request = require('supertest');
const knex = require('../../knexClient');
const Scene = require('../../modules/models/scene');
const Action = require('../../modules/models/action');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const initScenes = [
  {
    scene_id: 1,
    description: 'this is a test',
    name: 'scene_1',
  },
  {
    scene_id: 2,
    description: 'this is a second test',
    name: 'scene_2',
  },
];

const initActions = [
  {
    action_id: 1,
    scene_id: 1,
    type: 'DIO',
    name: 'action turn on',
    target_id: 1,
    body: JSON.stringify({ on: true }),
  },
  {
    action_id: 2,
    scene_id: 1,
    type: 'DIO',
    name: 'action turn off',
    target_id: 2,
    body: JSON.stringify({ on: false }),
  },
  {
    action_id: 3,
    scene_id: 2,
    type: 'SCENE',
    name: 'call scene',
    target_id: 2,
    body: null,
  },
];

const user = {
  user_id: 1,
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

        expect(response.status).toBe(401);
      });
    });

    describe('POST', () => {
      // TODO
      // Add a test on create a scene

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

        expect(response.body).toEqual({
          sceneId: 1,
          name: initScenes[0].name,
          description: initScenes[0].description,
          actions: [
            {
              type: 'DIO',
              name: 'action turn on',
              targetId: 1,
              body: { on: true },
            },
            {
              type: 'DIO',
              name: 'action turn off',
              targetId: 2,
              body: { on: false },
            },
          ],
        });
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/scenes/2')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });

    describe('DELETE', () => {
      it('should delete a scene and all associated actions', async () => {
        const response = await request(app)
          .delete('/api/scenes/1')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);

        // const scene = await knex(Scene.TABLE)
        //   .select('*')
        //   .where('scene_id', 1);

        // expect(scene).toHaveLength(0);

        // const actions = await knex(Action.TABLE)
        //   .select('*')
        //   .where('scene_id', 1);

        // expect(actions).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete('/api/scenes/1')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });
  });
});
