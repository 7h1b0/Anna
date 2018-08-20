import MockDate from 'mockdate';
import knex from '../../../knexClient';
import * as Scene from '../scene';
import * as Action from '../action';
const initScenes = [
  {
    scene_id: 1,
    description: 'this is a test',
    name: 'scene_1',
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
  },
  {
    scene_id: 2,
    description: 'this is a second test',
    name: 'scene_2',
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
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
    MockDate.reset();
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
      expect(result).toMatchSnapshot();
    });
  });

  describe('delete', () => {
    it('should delete a scene', async () => {
      await Scene.remove(1);
      const scenes = await knex(Scene.TABLE)
        .select('*')
        .where('scene_id', 1);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('scene_id', 1);
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
      MockDate.set('2018-05-05');
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
        .select('*')
        .where('scene_id', 3);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('scene_id', 3);
      expect(scenes).toMatchSnapshot();
      expect(actions).toMatchSnapshot();
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a scene', async () => {
      MockDate.set('2018-05-05');
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
        .select('*')
        .where('scene_id', 2);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('scene_id', 2);
      expect(scenes).toMatchSnapshot();
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
        .where('scene_id', 6);
      expect(scenes).toHaveLength(0);
      const actions = await knex(Action.TABLE)
        .select('*')
        .where('scene_id', 6);
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
