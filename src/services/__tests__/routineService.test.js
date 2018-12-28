import * as routineService from '../routineService';
import knex from '../../knexClient';
import * as Routine from '../../modules/models/routine';
import lolex from 'lolex';

jest.mock('../../modules/dispatch');

const initRoutines = [
  {
    routineId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
    name: 'test at 5am',
    interval: '0 5 * * *',
    enabled: true,
    runAtBankHoliday: true,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    routineId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '10c1d78e-fd1c-4717-b610-65d2fa3d01b2',
    name: 'test at 9am',
    interval: '0 9 * * *',
    enabled: true,
    runAtBankHoliday: false,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

describe('routineService', () => {
  afterEach(() => {});

  beforeAll(async () => {
    await knex(Routine.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Routine.TABLE).insert(initRoutines);
  });

  afterEach(async () => {
    await knex(Routine.TABLE).truncate();
    routineService.processes.forEach(process => clearTimeout(process));
    routineService.processes.clear();
  });

  describe('start', () => {
    it('should start a new process and call it every second', () => {
      const spy = jest.spyOn(Routine, 'run');
      const clock = lolex.install();
      routineService.start({
        routineId: 'test',
        interval: '* * * * * *',
        nextRunAt: new Date('2018-01-01'),
      });

      clock.tick(1000);
      clock.tick(1000);
      clock.uninstall();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should stop an older process if exist', () => {
      const clock = lolex.install();
      routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
        nextRunAt: new Date('2018-01-01'),
      });

      routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
        nextRunAt: new Date('2018-01-01'),
      });

      clock.uninstall();
      expect(clock.countTimers()).toBe(1);
    });

    it('should not start a new process if not enabled', () => {
      const spy = jest.spyOn(Routine, 'run');
      const clock = lolex.install();
      routineService.start(
        {
          routineId: 'test',
          enabled: false,
          interval: '* * * * * *',
          nextRunAt: new Date('2018-01-01'),
        },
        spy,
      );

      clock.next();
      clock.uninstall();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop a process', () => {
      const spy = jest.spyOn(Routine, 'run');
      const clock = lolex.install();
      routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '0 12 * * * *',
        nextRunAt: new Date('2018-01-01'),
      });

      routineService.stop('test');

      clock.next();
      clock.uninstall();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should do nothing if routineId is unknow', () => {
      const spy = jest.spyOn(Routine, 'run');
      const clock = lolex.install();
      routineService.start({
        routineId: 'test',
        enabled: true,
        interval: '* * * * * *',
        nextRunAt: new Date('2018-01-01'),
      });

      routineService.stop('unknow');
      clock.next();
      clock.uninstall();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('load', () => {
    it('should load and start every routine', async () => {
      const clock = lolex.install();
      await routineService.load();
      clock.uninstall();

      expect(clock.countTimers()).toBe(2);
    });
  });
});
