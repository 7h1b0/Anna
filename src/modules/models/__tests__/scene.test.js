const knex = require('../../../knexClient');
const Scene = require('../scene');
const Action = require('../action');
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
      const expected = [
        {
          sceneId: 1,
          description: 'this is a test',
          name: 'scene_1',
        },
        {
          sceneId: 2,
          description: 'this is a second test',
          name: 'scene_2',
        },
      ];

      const result = await Scene.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('delete', () => {
    it('should delete a scene', async () => {
      await Scene.delete(1);
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
      await Scene.delete(-1);
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

      await Scene.save(scene);

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

  describe('validate', () => {
    it('should return true when a scene is valid', () => {
      const scene = {
        name: 'test',
        description: 'my scene test',
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
