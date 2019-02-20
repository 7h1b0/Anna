import * as logger from '../logger';

describe('Logger', () => {
  beforeAll(() => {
    global.console.log = jest.fn();
  });

  beforeAll(() => {
    process.env.NODE_ENV = 'development';
  });

  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('info', () => {
    it('should return a valid text', () => {
      logger.info('test');

      expect(console.log).toBeCalled();
      expect(console.log).toHaveBeenCalledWith('[INFO] test');
    });
  });

  describe('warn', () => {
    it('should return a valid text', () => {
      logger.warn('test');

      expect(console.log).toBeCalled();
      expect(console.log).toHaveBeenCalledWith('[WARN] test');
    });
  });

  describe('error', () => {
    it('should return a valid text', () => {
      logger.error('test');

      expect(console.log).toBeCalled();
      expect(console.log).toHaveBeenCalledWith('[ERROR] test');
    });
  });
});
