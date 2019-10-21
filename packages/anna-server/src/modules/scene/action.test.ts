import knex from '../../knexClient';
import * as Action from './action';
import * as logger from 'utils/logger';
import { omit } from 'utils/utils';

jest.mock('utils/logger');

const initActions = [
  {
    actionId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '75442486-0878-440c-9db1-a7006c25a39f',
    type: 'DIO',
    name: 'action turn on',
    targetId: 1,
    body: { on: true },
  },
  {
    actionId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '75442486-0878-440c-9db1-a7006c25a39f',
    type: 'DIO',
    name: 'action turn off',
    targetId: 2,
    body: { on: false },
  },
  {
    actionId: '2fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '18feb598-32cb-472f-8b29-a7e7fe41e06b',
    type: 'HUE_LIGHT',
    name: 'call scene',
    targetId: 1,
    body: 'not a valid JSON}',
  },
];

describe('Action', () => {
  beforeAll(async () => {
    await knex(Action.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Action.TABLE).insert(
      initActions.map((action, index) => {
        if (index !== 2) {
          return { ...action, body: JSON.stringify(action.body) };
        }
        return action;
      }),
    );
  });

  afterEach(async () => {
    await knex(Action.TABLE).truncate();
  });

  describe('findBySceneId', () => {
    it('should return all actions given scene id', async () => {
      const result = await Action.findBySceneId(
        '75442486-0878-440c-9db1-a7006c25a39f',
      );
      const ignoredKeys = ['actionId', 'name', 'sceneId'];
      expect(result).toEqual([
        omit(initActions[0], ...ignoredKeys),
        omit(initActions[1], ...ignoredKeys),
      ]);
    });

    it('should handle when a body if malformed', async () => {
      const result = await Action.findBySceneId(
        '18feb598-32cb-472f-8b29-a7e7fe41e06b',
      );

      expect(result).toEqual([]);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
