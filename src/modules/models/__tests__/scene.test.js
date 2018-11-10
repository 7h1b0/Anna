import knex from '../../../knexClient';
import * as Scene from '../scene';
import * as Action from '../action';
const initScenes = [
  {
    sceneId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    description: 'this is a test',
    name: 'scene_1',
    createdBy: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    sceneId: '110c80e8-49e4-4d6b-b966-4fc9fb98879f',
    description: 'this is a second test',
    name: 'scene_2',
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const initActions = [
  {
    actionId: '0a1834fe-40c8-4a6f-9b74-b79be7694644',
    sceneId: initScenes[0].sceneId,
    type: 'DIO',
    name: 'action turn on',
    targetId: 1,
    body: JSON.stringify({ on: true }),
  },
  {
    actionId: '18feb598-32cb-472f-8b29-a7e7fe41e06b',
    sceneId: initScenes[0].sceneId,
    type: 'DIO',
    name: 'action turn off',
    targetId: 2,
    body: JSON.stringify({ on: false }),
  },
  {
    actionId: '29699398-449c-48fb-8f5c-84186cdf8279',
    sceneId: initScenes[1].sceneId,
    type: 'HUE_LIGHT',
    name: 'call scene',
    targetId: 1,
    body: null,
  },
];

describe('Scene', () => {
  beforeAll(async () => {
    await Promise.all([
      knex(Scene.TABLE).truncate(),
      knex(Action.TABLE).truncate(),
    ]);
  });

  beforeEach(async () => {
    await Promise.all([
      knex(Scene.TABLE).insert(initScenes),
      knex(Action.TABLE).insert(initActions),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      knex(Scene.TABLE).truncate(),
      knex(Action.TABLE).truncate(),
    ]);
  });

  describe('findAll', () => {
    it('should return all scene', async () => {
      const result = await Scene.findAll();
      expect(result).toEqual(initScenes);
    });
  });

  describe('delete', () => {
    it('should delete a scene', async () => {
      await Scene.remove(initScenes[0].sceneId);
      const scenes = await knex(Scene.TABLE)
        .select()
        .where('sceneId', initScenes[0].sceneId);
      const actions = await knex(Action.TABLE)
        .select()
        .where('sceneId', initScenes[0].sceneId);
      expect(scenes).toHaveLength(0);
      expect(actions).toHaveLength(0);
    });

    it('should not delete a scene', async () => {
      await Scene.remove(-1);
      const scenes = await knex(Scene.TABLE).select();
      const actions = await knex(Action.TABLE).select();
      expect(scenes).toEqual(initScenes);
      expect(actions).toEqual(initActions);
    });
  });

  describe('save', () => {
    it('should save a new scene', async () => {
      const scene = {
        description: 'save test',
        name: 'scene_3',
        userId: '75442486-0878-440c-9db1-a7006c25a39f',
        actions: [
          {
            targetId: 1,
            name: 'action one',
            type: 'DIO',
            body: {
              on: true,
            },
          },
          {
            targetId: 1,
            name: 'action two',
            type: 'HUE_LIGHT',
            body: {
              on: true,
              bri: 255,
            },
          },
        ],
      };

      const id = await Scene.save(scene);
      expect(id).toMatch(/[a-fA-F0-9-]{36}/);

      const scenes = await knex(Scene.TABLE)
        .first()
        .where('sceneId', id);
      const actions = await knex(Action.TABLE)
        .select()
        .where('sceneId', id);
      expect(scenes).toMatchSnapshot({
        sceneId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(actions).toHaveLength(2);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a scene', async () => {
      const updatedScene = {
        sceneId: initScenes[1].sceneId,
        description: 'this is an updated second test',
        name: 'scene_2',
        actions: [
          {
            type: 'DIO',
            name: 'action turn off',
            targetId: 2,
            body: { on: false },
          },
          {
            type: 'DIO',
            name: 'action turn off',
            targetId: 4,
            body: { on: true },
          },
        ],
      };

      await Scene.findByIdAndUpdate(updatedScene);

      const scenes = await knex(Scene.TABLE)
        .first()
        .where('sceneId', initScenes[1].sceneId);
      const actions = await knex(Action.TABLE)
        .select()
        .where('sceneId', initScenes[1].sceneId)
        .orderBy('targetId');

      expect(scenes).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(actions).toHaveLength(2);
      expect(actions[0]).toMatchSnapshot(
        {
          actionId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        },
        'first action',
      );
      expect(actions[1]).toMatchSnapshot(
        {
          actionId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        },
        'second action',
      );
    });

    it('should not update a scene if sceneId is unknow', async () => {
      const fakeSceneId = 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f';
      const updatedScene = {
        sceneId: fakeSceneId,
        description: 'this is an updated second test',
        name: 'scene_2',
        actions: [
          {
            type: 'DIO',
            name: 'action turn off',
            targetId: 2,
            body: { on: false },
          },
          {
            type: 'DIO',
            name: 'action turn off',
            targetId: 4,
            body: { on: true },
          },
        ],
      };

      const res = await Scene.findByIdAndUpdate(updatedScene);
      expect(res).toBe(0);

      const scenes = await knex(Scene.TABLE)
        .select()
        .where('sceneId', fakeSceneId);
      const actions = await knex(Action.TABLE)
        .select()
        .where('sceneId', fakeSceneId);

      expect(scenes).toHaveLength(0);
      expect(actions).toHaveLength(0);
    });
  });

  describe('validate', () => {
    it('should return true when a scene is valid', () => {
      const scene = {
        name: 'test',
        description: 'my scene test',
        actions: [
          {
            targetId: 2,
            type: 'DIO',
            body: {
              on: true,
            },
          },
        ],
      };

      expect(Scene.validate(scene)).toBeTruthy();
    });

    it('should return false when no actions is provided', () => {
      const scene = {
        name: 'test',
        description: 'my scene test',
      };

      expect(Scene.validate(scene)).toBeFalsy();
    });

    it('should return false when an actions is missing props', () => {
      const scene = {
        name: 'test',
        description: 'my scene test',
        actions: [
          {
            targetId: 1,
            name: 'test',
            body: {
              on: true,
            },
          },
        ],
      };

      expect(Scene.validate(scene)).toBeFalsy();
    });

    it('should return true when no description is provided', () => {
      const scene = {
        name: 'test',
        actions: [
          {
            targetId: 1,
            name: 'test',
            type: 'DIO',
            body: {
              on: true,
            },
          },
        ],
      };

      expect(Scene.validate(scene)).toBeTruthy();
    });

    it('should return false when the type of an actions is unknow', () => {
      const scene = {
        name: 'test',
        actions: [
          {
            targetId: 1,
            name: 'test',
            type: 'TEST',
            body: {
              on: true,
            },
          },
        ],
      };

      expect(Scene.validate(scene)).toBeFalsy();
    });

    it('should return false when targetId is a string', () => {
      const scene = {
        name: 'test',
        actions: [
          {
            targetId: '1',
            name: 'test',
            type: 'TEST',
            body: {
              on: true,
            },
          },
        ],
      };

      expect(Scene.validate(scene)).toBeFalsy();
    });
  });
});
