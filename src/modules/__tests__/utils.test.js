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

  describe('isBankHoliday', () => {
    it('should return true on christmas', () => {
      expect(utils.isBankHoliday(new Date('2017-12-25'))).toBeTruthy();
    });

    it('should return true on august 15', () => {
      expect(utils.isBankHoliday(new Date('2017-08-15'))).toBeTruthy();
    });

    it('should return true on easter Monday', () => {
      expect(utils.isBankHoliday(new Date('2017-04-17'))).toBeTruthy();
    });

    it('should return false on january 12', () => {
      expect(utils.isBankHoliday(new Date('2017-01-12'))).toBeFalsy();
    });
  });
});
