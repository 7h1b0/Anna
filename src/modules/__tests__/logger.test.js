import * as logger from '../logger';

describe('Logger', () => {
  beforeAll(() => {
    const DATE_MOCK = new Date(2018, 1, 1, 10, 0, 0);
    global.Date = jest.fn(() => DATE_MOCK);
    global.console.log = jest.fn();
  });

  afterEach(() => {
    global.Date.mockClear();
    global.console.log.mockClear();
  });

  afterAll(() => {
    global.Date.mockReset();
    global.console.log.mockReset();
  });

  describe('info', () => {
    it('should return a valid text', () => {
      logger.info('test', true);

      expect(console.log).toBeCalled();
      expect(console.log).toHaveBeenCalledWith('10:00:00 [INFO] test');
    });
  });

  describe('warn', () => {
    it('should return a valid text', () => {
      logger.warn('test', true);

      expect(console.log).toBeCalled();
      expect(console.log).toHaveBeenCalledWith('10:00:00 [WARN] test');
    });
  });

  describe('error', () => {
    it('should return a valid text', () => {
      logger.error('test', true);

      expect(console.log).toBeCalled();
      expect(console.log).toHaveBeenCalledWith('10:00:00 [ERROR] test');
    });
  });
});
