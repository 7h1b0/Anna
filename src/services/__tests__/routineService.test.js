import * as routineService from '../routineService';
import * as Routine from '../../modules/models/routine';
import sinon from 'sinon';

jest.unmock('cron').mock('../../modules/models/routine', () => ({
  run: jest.fn(),
  findAll: () => [
    {
      routineId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
      sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
      name: 'every second',
      interval: '* * * * * *',
      enabled: true,
      runAtBankHoliday: true,
      createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
      createdAt: new Date('2018-01-01'),
      updatedAt: new Date('2018-01-02'),
    },
    {
      routineId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
      sceneId: '10c1d78e-fd1c-4717-b610-65d2fa3d01b2',
      name: 'every second too',
      interval: '* * * * * *',
      enabled: true,
      runAtBankHoliday: true,
      createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
      createdAt: new Date('2018-01-01'),
      updatedAt: new Date('2018-01-02'),
    },
  ],
}));

describe('routineService', () => {
  const clock = sinon.useFakeTimers();

  afterEach(() => {
    routineService.processes.clear();
    Routine.run.mockClear();
  });

  afterAll(() => {
    clock.restore();
  });

  describe('start', () => {
    it('should start a new process and call it every second', () => {
      const process = routineService.start({
        routineId: 'test',
        interval: '* * * * * *',
      });

      clock.tick(1000);

      expect(Routine.run).toHaveBeenCalledTimes(1);
      process.stop();
    });

    it('should stop an older process if exist', () => {
      const processOne = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
      });

      const processTwo = routineService.start({
        routineId: 'test',
        interval: '* * * * * *',
      });

      clock.tick(1000);

      expect(Routine.run).toHaveBeenCalledTimes(1);

      processOne.stop();
      processTwo.stop();
    });

    it('should not start a new process if not enabled', () => {
      routineService.start({
        routineId: 'test',
        enabled: false,
        interval: '* * * * * *',
      });

      clock.tick(1000);

      expect(Routine.run).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop a process', () => {
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
      });

      routineService.stop('test');

      clock.tick(1000);
      expect(Routine.run).not.toHaveBeenCalled();
      process.stop();
    });

    it('should do nothing if routineId is unknow', () => {
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
      });

      routineService.stop('unknow');
      clock.tick(1000);

      expect(Routine.run).toHaveBeenCalledTimes(1);
      process.stop();
    });
  });

  describe('load', () => {
    it('should load and start every routine', async () => {
      await routineService.load();

      clock.tick(1000);

      expect(Routine.run).toHaveBeenCalledTimes(2);
    });
  });
});
