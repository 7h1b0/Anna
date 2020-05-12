import * as actions from './actions';

describe('Actions', () => {
  describe.each([
    [
      '2',
      true,
      {
        type: 'DIO',
        body: { on: true },
        targetId: '2',
      },
    ],
    [
      '5',
      false,
      {
        type: 'DIO',
        body: { on: false },
        targetId: '5',
      },
    ],
  ])('toggleDio', (targetId, state, expected) => {
    it('should return a valid object', () => {
      expect(actions.toggleDio(targetId, state)).toEqual(expected);
    });
  });

  describe.each([
    [
      '1',
      true,
      {
        type: 'HUE_LIGHT',
        body: { on: true },
        targetId: '1',
      },
    ],
    [
      '4',
      false,
      {
        type: 'HUE_LIGHT',
        body: { on: false },
        targetId: '4',
      },
    ],
  ])('toggleHueLight', (targetId, state, expected) => {
    it('should return a valid object', () => {
      expect(actions.toggleHueLight(targetId, state)).toEqual(expected);
    });
  });

  describe('callScene', () => {
    it('should return a valid object', () => {
      const expected = {
        type: 'SCENE',
        targetId: '1',
      };

      expect(actions.callScene('1')).toEqual(expected);
    });
  });
});
