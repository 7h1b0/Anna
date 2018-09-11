import * as utils from '../utils';

describe('Utils', () => {
  describe('omit', () => {
    it('should return a new object without specific keys', () => {
      const a = {
        anna: 1,
        id: 2,
        updatedAt: 3,
      };
      expect(utils.omit(a, ['id', 'updatedAt'])).toEqual({ anna: 1 });
    });

    it('should return a new object', () => {
      const a = {
        anna: 1,
        id: 2,
        updatedAt: 3,
      };
      expect(utils.omit(a)).toEqual(a);
    });

    it('should return a object without props', () => {
      const a = {
        anna: 1,
        id: 2,
        updatedAt: 3,
      };
      expect(utils.omit(a, ['anna', 'id', 'updatedAt'])).toEqual({});
    });
  });
});
