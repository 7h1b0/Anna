const dbUtil = require('../dbUtil');

describe('dbUtil', () => {
  describe('returnFirst', () => {
    it('should return the first element of an array', async () => {
      const res = await dbUtil.returnFirst(Promise.resolve([1, 2, 3]));

      expect(res).toBe(1);
    });
  });
});
