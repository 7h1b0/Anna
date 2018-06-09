const knex = require('../../../knexClient');
const Action = require('../action');

jest.mock('../../logger');
const logger = require('../../logger');

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

describe('Action', () => {
  beforeAll(async () => {
    await knex(Action.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Action.TABLE).insert(initActions);
  });

  afterEach(async () => {
    await knex(Action.TABLE).truncate();
  });

  describe('findBySceneId', () => {
    it('should return all actions given scene id', async () => {
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

      const result = await Action.findBySceneId(1);
      expect(result).toEqual(expected);
    });

    it('should handle when a body if malformed', async () => {
      const action = {
        action_id: 4,
        scene_id: 2,
        type: 'DIO',
        name: 'action turn off',
        target_id: 2,
        body: 'tototo',
      };

      const expected = [
        {
          type: 'SCENE',
          name: 'call scene',
          targetId: 2,
          body: null,
        },
      ];

      await knex(Action.TABLE).insert(action);

      const result = await Action.findBySceneId(2);

      expect(result).toEqual(expected);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
