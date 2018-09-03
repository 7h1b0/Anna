import knex from '../../../knexClient';
import * as Scene from '../scene';
import * as Action from '../action';
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

  afterAll(async () => {
    await knex.destroy();
  });

  describe('findAll', () => {
    it('should return all scene', async () => {
      const result = await Scene.findAll();
      expect(result).toEqual(initScenes);
    });
  });

  describe('delete', () => {
    it('should delete a scene', async () => {
      await Scene.remove(1);
      const scenes = await knex(Scene.TABLE)
        .select('*')
        .where('sceneId', 1);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('sceneId', 1);
      expect(scenes).toHaveLength(0);
      expect(actions).toHaveLength(0);
    });

    it('should not delete a scene', async () => {
      await Scene.remove(-1);
      const scenes = await knex(Scene.TABLE).select('*');
      const actions = await knex(Action.TABLE).select('*');
      expect(scenes).toEqual(initScenes);
      expect(actions).toEqual(initActions);
    });
  });

  describe('save', () => {
    it('should save a new scene', async () => {
      const scene = {
        description: 'save test',
        name: 'scene_3',
        userId: 1,
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
      expect(id).toBe(3);

      const scenes = await knex(Scene.TABLE)
        .first('*')
        .where('sceneId', id);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('sceneId', id);
      expect(scenes).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(actions).toMatchSnapshot();
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a scene', async () => {
      const updatedScene = {
        sceneId: 2,
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
        .first('*')
        .where('sceneId', 2);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('sceneId', 2);
      expect(scenes).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(actions).toMatchSnapshot();
    });

    it('should not update a scene if sceneId is unknow', async () => {
      const updatedScene = {
        sceneId: 6,
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
        .select('*')
        .where('sceneId', 6);
      expect(scenes).toHaveLength(0);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('sceneId', 6);
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
            targetId: 1,
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
  });
});
