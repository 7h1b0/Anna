import * as logger from '../logger';

describe('Logger', () => {
  beforeAll(() => {
    const DATE_MOCK = new Date(2018, 1, 1, 10, 0, 0);
    global.Date = jest.fn(() => DATE_MOCK);
    global.console.log = jest.fn();
  });

  afterAll(() => {
    global.Date.mockReset();
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

  describe('in production', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      process.env.NODE_ENV = 'test';
    });

    describe('info', () => {
      it('should not be display', () => {
        logger.info('test');

        expect(console.log).not.toBeCalled();
      });

      it('should return a valid text is forceDiplay is set', () => {
        logger.info('test', true);

        expect(console.log).toBeCalled();
        expect(console.log).toHaveBeenCalledWith('10:00:00 [INFO] test');
      });
    });

    describe('warn', () => {
      it('should not be display', () => {
        logger.warn('test');

        expect(console.log).not.toBeCalled();
      });

      it('should return a valid text is forceDiplay is set', () => {
        logger.warn('test', true);

        expect(console.log).toBeCalled();
        expect(console.log).toHaveBeenCalledWith('10:00:00 [WARN] test');
      });
    });

    describe('error', () => {
      it('should return a valid text', () => {
        logger.error('test');

        expect(console.log).toBeCalled();
        expect(console.log).toHaveBeenCalledWith('10:00:00 [ERROR] test');
      });
    });
  });
});
