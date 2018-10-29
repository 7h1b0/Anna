import * as routineService from '../routineService';
import { CronJob } from 'cron';
import * as Routine from '../../modules/models/routine';
import knex from '../../knexClient';

const routines = [
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
    runAtBankHoliday: true,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

jest.mock('cron');

describe('routineService', () => {
  afterEach(() => {
    routineService.processes.clear();
  });

  afterAll(() => {
    CronJob.mockRestore();
  });

  describe('start', () => {
    it('should start a new process', () => {
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
        interval: 'custom interval',
      });

      expect(routineService.processes.size).toBe(1);
      expect(CronJob).toHaveBeenCalledWith(
        'custom interval',
        expect.any(Function),
        null,
        true,
      );
      expect(routineService.processes.get('test')).toEqual(process);
    });

    it('should stop an older process if exist', () => {
      const processOne = routineService.start({
        routineId: 'test',
        enabled: true,
      });

      const processTwo = routineService.start({
        routineId: 'test',
        enabled: true,
      });

      expect(processOne.stop).toHaveBeenCalledTimes(1);
      expect(CronJob).toHaveBeenCalled();
      expect(routineService.processes.size).toBe(1);
      expect(routineService.processes.get('test')).toEqual(processTwo);
    });

    it('should not start a new process if not enabled', () => {
      routineService.start({
        routineId: 'test',
        enabled: false,
      });

      expect(CronJob).not.toHaveBeenCalled();
      expect(routineService.processes.size).toBe(0);
    });
  });

  describe('stop', () => {
    it('should stop a process', () => {
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
      });

      routineService.stop('test');
      expect(process.stop).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if routineId is unknow', () => {
      const process = routineService.start({
        routineId: 'test',
        enabled: true,
      });

      routineService.stop('unknow');
      expect(process.stop).not.toHaveBeenCalled();
    });
  });

  describe('load', () => {
    beforeAll(async () => {
      await knex(Routine.TABLE).truncate();
    });

    beforeEach(async () => {
      await knex(Routine.TABLE).insert(routines);
    });

    afterEach(async () => {
      await knex(Routine.TABLE).truncate();
    });

    it('should load and start every routine', async () => {
      await routineService.load();
      expect(routineService.processes.size).toBe(2);
      expect(
        routineService.processes.has('0fc1d78e-fd1c-4717-b610-65d2fa3d01b2'),
      ).toBeTruthy();
      expect(
        routineService.processes.has('1fc1d78e-fd1c-4717-b610-65d2fa3d01b2'),
      ).toBeTruthy();
      expect(CronJob).toHaveBeenCalledTimes(2);
    });
  });
});
