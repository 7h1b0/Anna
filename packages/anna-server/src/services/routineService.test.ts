import * as routineService from './routineService';
import knex from 'knexClient';
import * as Routine from 'modules/routine/model';
import { createRoutine } from 'factories';
import lolex from '@sinonjs/fake-timers';

jest.mock('utils/dispatch');

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
    routineService.processes.forEach((process) => clearTimeout(process));
    routineService.processes.clear();
  });

  describe('schedule', () => {
    it('should schedule a new process and call it every second', () => {
      const spy = jest.spyOn(Routine, 'run');
      const clock = lolex.install();
      routineService.schedule(
        createRoutine({
          interval: '* * * * * *',
        }),
      );

      clock.tick(1000); // should call Routine.run
      clock.tick(1000); // should call Routine.run for the second times
      clock.uninstall();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should stop process with the same id', () => {
      const clock = lolex.install();
      routineService.schedule(
        createRoutine({
          routineId: 'test',
          enabled: true,
          interval: '* * * * * *',
          nextRunAt: new Date('2018-01-01'),
        }),
      );

      routineService.schedule(
        createRoutine({
          routineId: 'test',
          enabled: true,
          interval: '* * * * * *',
          nextRunAt: new Date('2018-01-01'),
        }),
      );

      clock.uninstall();
      expect(clock.countTimers()).toBe(1);
    });

    it('should not schedule a new process if not enabled', () => {
      const spy = jest.spyOn(Routine, 'run');
      const clock = lolex.install();
      routineService.schedule(
        createRoutine({
          routineId: 'test',
          enabled: false,
          interval: '* * * * * *',
          nextRunAt: new Date('2018-01-01'),
        }),
      );

      clock.next();
      clock.uninstall();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop an existing process', () => {
      const clock = lolex.install();
      routineService.schedule(
        createRoutine({
          routineId: 'test',
          enabled: true,
          interval: '0 12 * * * *',
          nextRunAt: new Date('2018-01-01'),
        }),
      );

      expect(clock.countTimers()).toBe(1);
      routineService.stop('test');
      expect(clock.countTimers()).toBe(0);

      clock.uninstall();
    });

    it('should do nothing if routineId is unknow', () => {
      const clock = lolex.install();
      routineService.schedule(
        createRoutine({
          routineId: 'test',
          enabled: true,
          interval: '* * * * * *',
          nextRunAt: new Date('2018-01-01'),
        }),
      );

      expect(clock.countTimers()).toBe(1);
      routineService.stop('unknow');
      expect(clock.countTimers()).toBe(1);

      clock.uninstall();
    });
  });

  describe('diffInMilliseconds', () => {
    it('should return the diff between the next run at and now', () => {
      const clock = lolex.install({ now: new Date('2019-01-01T08:00') });
      const milliseconds = routineService.diffInMilliseconds(
        '0 10 * * *',
        true,
      );
      clock.uninstall();

      expect(milliseconds).toBe(1000 * 60 * 60 * 2);
    });

    it('should handle bank holiday', () => {
      const clock = lolex.install({ now: new Date('2019-01-01T08:00') });
      const milliseconds = routineService.diffInMilliseconds(
        '0 10 * * *',
        false,
      );
      clock.uninstall();

      expect(milliseconds).toBe(1000 * 60 * 60 * 26);
    });
  });

  describe('load', () => {
    it('should load and start every routine', async () => {
      const clock = lolex.install();
      await routineService.load();
      clock.uninstall();

      expect(clock.countTimers()).toBe(2);
    });

    it('should update all computeNextRunAt', async () => {
      const clock = lolex.install({ now: new Date('2019-01-01T00:00') });
      await routineService.load();
      clock.uninstall();

      const routines = await knex(Routine.TABLE).orderBy('routineId');

      expect(routines[0].nextRunAt).toEqual(
        new Date('2019-01-01T05:00').getTime(),
      );
      expect(routines[1].nextRunAt).toEqual(
        new Date('2019-01-02T09:00').getTime(),
      );
    });
  });
});
