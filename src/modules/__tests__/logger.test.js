import * as logger from '../logger';

describe('Logger', () => {
  beforeAll(() => {
    global.console.log = jest.fn();
  });

  afterAll(() => {
    global.console.log.mockReset();
  });

  describe('in development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });

    afterAll(() => {
      process.env.NODE_ENV = 'test';
    });

    describe('info', () => {
      it('should return a valid text', () => {
        logger.info('test', true);

        expect(console.log).toBeCalled();
        expect(console.log).toHaveBeenCalledWith('[INFO] test');
      });
    });

    describe('warn', () => {
      it('should return a valid text', () => {
        logger.warn('test', true);

        expect(console.log).toBeCalled();
        expect(console.log).toHaveBeenCalledWith('[WARN] test');
      });
    });

    describe('error', () => {
      it('should return a valid text', () => {
        logger.error('test', true);

        expect(console.log).toBeCalled();
        expect(console.log).toHaveBeenCalledWith('[ERROR] test');
      });
    });
  });
});
