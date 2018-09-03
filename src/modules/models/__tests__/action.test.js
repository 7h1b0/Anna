import knex from '../../../knexClient';
import * as Action from '../action';
import * as logger from '../../logger';

jest.mock('../../logger');

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

  afterAll(async () => {
    await knex.destroy();
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
        actionId: 4,
        sceneId: 2,
        type: 'DIO',
        name: 'action turn off',
        targetId: 2,
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
