import Schedule from '../schedule';
import * as cron from 'cron';

jest.mock('cron');

describe('Schedule', () => {
  afterEach(() => {
    cron.CronJob.mockClear();
    cron.CronTime.mockClear();
  });

  describe('isPublicHoliday', () => {
    it('should return true on public holidays', () => {
      const feteNationale = new Date(2012, 6, 14).getTime();
      expect(Schedule.isPublicHoliday(feteNationale)).toBeTruthy();

      const lundiDePaques = new Date(2019, 3, 22).getTime();
      expect(Schedule.isPublicHoliday(lundiDePaques)).toBeTruthy();

      const ascension = new Date(2020, 4, 21).getTime();
      expect(Schedule.isPublicHoliday(ascension)).toBeTruthy();
    });

    it('should return false on every day except public holidays', () => {
      const day1 = new Date(2012, 6, 15).getTime();
      expect(Schedule.isPublicHoliday(day1)).toBeFalsy();

      const day2 = new Date(2020, 4, 22).getTime();
      expect(Schedule.isPublicHoliday(day2)).toBeFalsy();
    });
  });

  describe('Stop', () => {
    it('should stop the process', () => {
      const job = new Schedule({ name: 'test', interval: '', cb: jest.fn() });

      job.start();
      job.stop();

      expect(job.attrs.isRunning).toBeFalsy();
      expect(job.process.stop).toHaveBeenCalled();
    });

    it('should not called stop is process is not started', () => {
      const job = new Schedule({ name: 'test', interval: '', cb: jest.fn() });

      job.stop();

      expect(job.attrs.isRunning).toBeFalsy();
      expect(job.process).toBeUndefined();
    });
  });

  describe('Start', () => {
    it('should start the cron', () => {
      const job = new Schedule({ name: 'test', interval: '', cb: jest.fn() });

      job.start();

      expect(job.attrs.isRunning).toBeTruthy();
      expect(cron.CronJob).toHaveBeenCalled();
    });
  });

  describe('update Interval', () => {
    it('should restart the process', () => {
      const job = new Schedule({ name: 'test', interval: '', cb: jest.fn() });
      const newInterval = 'new interval';

      const process = job.start();
      const newProcess = job.updateInterval(newInterval);

      expect(job.attrs.interval).toBe(newInterval);
      expect(job.attrs.isRunning).toBeTruthy();
      expect(cron.CronJob).toHaveBeenCalledTimes(2);

      expect(process.stop).toHaveBeenCalledTimes(1);
      expect(newProcess.stop).toHaveBeenCalledTimes(0);
    });
  });

  describe('update', () => {
    it('should update the name without recreating process or calcule next run', () => {
      const job = new Schedule({ name: 'test', interval: '', cb: jest.fn() });
      const name = 'new name';

      job.update({ name });

      expect(job.attrs.name).toBe(name);

      expect(cron.CronJob).toHaveBeenCalledTimes(0);
      expect(cron.CronTime).toHaveBeenCalledTimes(1);
    });

    it('should update interval', () => {
      const job = new Schedule({ name: 'test', interval: '', cb: jest.fn() });
      const interval = 'new interval';

      const process = job.start();
      job.update({ interval });

      expect(job.attrs.interval).toBe(interval);
      expect(job.attrs.isRunning).toBeTruthy();
      expect(cron.CronJob).toHaveBeenCalledTimes(2);
      expect(cron.CronTime).toHaveBeenCalledTimes(2);
      expect(process.stop).toHaveBeenCalledTimes(1);
    });

    it('should update next run', () => {
      const job = new Schedule({
        name: 'test',
        interval: '',
        cb: jest.fn(),
        runAtPublicHoliday: true,
      });

      const runAtPublicHoliday = false;

      const process = job.start();
      job.update({ runAtPublicHoliday });

      expect(job.attrs.runAtPublicHoliday).toBeFalsy();
      expect(job.attrs.isRunning).toBeTruthy();
      expect(cron.CronJob).toHaveBeenCalledTimes(1);
      expect(cron.CronTime).toHaveBeenCalledTimes(2);
      expect(process.stop).toHaveBeenCalledTimes(0);
    });
  });
});
