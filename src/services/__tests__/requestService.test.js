const requestService = require('../requestService');

describe('requestService', () => {
  describe('isSuccess', () => {
    it('should return true when status is >= 200 and < 300', () => {
      expect(requestService.isSuccess(200)).toBeTruthy();
      expect(requestService.isSuccess(201)).toBeTruthy();
      expect(requestService.isSuccess(204)).toBeTruthy();
    });

    it('should return false is status > 300', () => {
      expect(requestService.isSuccess(301)).toBeFalsy();
      expect(requestService.isSuccess(500)).toBeFalsy();
      expect(requestService.isSuccess(404)).toBeFalsy();
    });
  });

  describe('getRoute', () => {
    it('should return an object #1', () => {
      expect(
        requestService.getRoute('http://anna.com', 'GET'),
      ).toMatchSnapshot();
    });

    it('should return an object #2', () => {
      expect(
        requestService.getRoute('http://anna.com/test', 'post', { on: true }),
      ).toMatchSnapshot();
    });
  });
});
