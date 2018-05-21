const knex = require('../../../knexClient');
const Scene = require('../scene');
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
      knex(Scene.ACTION_TABLE).truncate(),
    ]);
  });

  beforeEach(async () => {
    await Promise.all([
      knex(Scene.TABLE).insert(initScenes),
      knex(Scene.ACTION_TABLE).insert(initActions),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      knex(Scene.TABLE).truncate(),
      knex(Scene.ACTION_TABLE).truncate(),
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

  describe('findActionsBySceneId', () => {
    it('should return all actions for a given scene id', async () => {
      const expected = [
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
      ];

      const result = await Scene.findActionsBySceneId(1);
      expect(result).toEqual(expected);
    });
  });

  describe('delete', () => {
    it('should delete a scene', async () => {
      await Scene.delete(1);
      const scenes = await knex(Scene.TABLE).select('*');
      const actions = await knex(Scene.ACTION_TABLE).select('*');
      expect(scenes).toMatchSnapshot();
      expect(actions).toMatchSnapshot();
    });

    it('should not delete a scene', async () => {
      await Scene.delete(-1);
      const scenes = await knex(Scene.TABLE).select('*');
      const actions = await knex(Scene.ACTION_TABLE).select('*');
      expect(scenes).toEqual(initScenes);
      expect(actions).toEqual(initActions);
    });
  });
});
