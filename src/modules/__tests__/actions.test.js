import * as actions from '../actions';

describe('Actions', () => {
  describe('toggleDio', () => {
    it('should return a valid object', () => {
      const expected = {
        type: 'DIO',
        body: { on: true },
        id: 2,
      };

      expect(actions.toggleDio(2, true)).toEqual(expected);
    });

    it('should return a valid object', () => {
      const expected = {
        type: 'DIO',
        body: { on: false },
        id: 5,
      };

      expect(actions.toggleDio(5, false)).toEqual(expected);
    });
  });

  describe('toggleHueLight', () => {
    it('should return a valid object', () => {
      const expected = {
        type: 'HUE_LIGHT',
        body: { on: true },
        id: 1,
      };

      expect(actions.toggleHueLight(1, true)).toEqual(expected);
    });

    it('should return a valid object', () => {
      const expected = {
        type: 'HUE_LIGHT',
        body: { on: false },
        id: 4,
      };

      expect(actions.toggleHueLight(4, false)).toEqual(expected);
    });
  });

  describe('callScene', () => {
    it('should return a valid object', () => {
      const expected = {
        type: 'SCENE',
        id: 1,
      };

      expect(actions.callScene(1)).toEqual(expected);
    });
  });
});
