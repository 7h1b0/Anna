import * as routineService from '../routineService';
import * as Routine from '../../modules/models/routine';
import lolex from 'lolex';

jest.mock('../../modules/models/routine', () => ({
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
  afterEach(() => {
    routineService.processes.clear();
    Routine.run.mockClear();
  });

  describe('start', () => {
    it('should start a new process and call it every second', () => {
      const clock = lolex.install();
      const process = routineService.start({
        routineId: 'test',
        interval: '* * * * * *',
      });

      clock.next();

      expect(Routine.run).toHaveBeenCalledTimes(1);
      process.stop();
      clock.uninstall();
    });

    it('should stop an older process if exist', () => {
      const clock = lolex.install();
      const processOne = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
      });

      const processTwo = routineService.start({
        routineId: 'test',
        interval: '* * * * * *',
      });

      clock.next();

      expect(Routine.run).toHaveBeenCalledTimes(1);

      processOne.stop();
      processTwo.stop();
      clock.uninstall();
    });

    it('should not start a new process if not enabled', () => {
      const clock = lolex.install();
      routineService.start({
        routineId: 'test',
        enabled: false,
        interval: '* * * * * *',
      });

      clock.next();

      expect(Routine.run).not.toHaveBeenCalled();
      clock.uninstall();
    });
  });

  describe('stop', () => {
    it('should stop a process', () => {
      const clock = lolex.install();
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '0 12 * * * *',
      });

      routineService.stop('test');

      clock.next();
      expect(Routine.run).not.toHaveBeenCalled();
      process.stop();
      clock.uninstall();
    });

    it('should do nothing if routineId is unknow', () => {
      const clock = lolex.install();
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
      });

      routineService.stop('unknow');
      clock.next();

      expect(Routine.run).toHaveBeenCalledTimes(1);
      process.stop();
      clock.uninstall();
    });
  });

  describe('load', () => {
    it('should load and start every routine', async () => {
      const clock = lolex.install();
      await routineService.load();

      expect(clock.countTimers()).toBe(2);
      clock.uninstall();
    });
  });
});
