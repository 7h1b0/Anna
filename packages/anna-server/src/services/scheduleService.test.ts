import * as lolex from '@sinonjs/fake-timers';
import * as ScheduleService from './scheduleService';

describe('scheduleService', () => {
  afterEach(async () => {
    ScheduleService.processes.forEach((process) => clearTimeout(process));
    ScheduleService.processes.clear();
  });

  describe('computeNextRunAt', () => {
    it('should compute the next date', () => {
      const clock = lolex.install({ now: new Date('2017-08-12T16:00') });
      const nextRunAt = ScheduleService.computeNextRunAt('0 12 * * *');
      clock.uninstall();

      expect(nextRunAt).toEqual(new Date('2017-08-13T12:00'));
    });

    it('should handle bank holiday to compute the next date', () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const nextRunAt = ScheduleService.computeNextRunAt('0 12 * * *', false);
      clock.uninstall();

      expect(nextRunAt).toEqual(new Date('2017-08-16T12:00'));
    });

    it('should ignore bank holiday to compute the next date', () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const nextRunAt = ScheduleService.computeNextRunAt('0 12 * * *', true);
      clock.uninstall();

      expect(nextRunAt).toEqual(new Date('2017-08-15T12:00'));
    });
  });

  describe('schedule', () => {
    it('should schedule a new process and call it every second', () => {
      const spy = jest.fn();
      const clock = lolex.install();
      ScheduleService.schedule('test', '* * * * * *', spy);

      clock.tick(1000); // should call spy
      clock.tick(1000); // should call spy for the second times
      clock.uninstall();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should stop process with the same id', () => {
      const clock = lolex.install();
      ScheduleService.schedule('test', '* * * * * *', jest.fn());
      ScheduleService.schedule('test', '* * * * * *', jest.fn());

      clock.uninstall();
      expect(clock.countTimers()).toBe(1);
    });
  });

  describe('stop', () => {
    it('should stop an existing process', () => {
      const clock = lolex.install();
      ScheduleService.schedule('test', '0 12 * * * *', jest.fn());

      expect(clock.countTimers()).toBe(1);
      ScheduleService.stop('test');
      expect(clock.countTimers()).toBe(0);

      clock.uninstall();
    });

    it('should do nothing if id is unknown', () => {
      const clock = lolex.install();
      ScheduleService.schedule('test', '* * * * * *', jest.fn());

      expect(clock.countTimers()).toBe(1);
      ScheduleService.stop('unknow');
      expect(clock.countTimers()).toBe(1);

      clock.uninstall();
    });
  });

  describe('diffInMilliseconds', () => {
    it('should return the diff between the next run at and now', () => {
      const clock = lolex.install({ now: new Date('2019-01-01T08:00') });
      const milliseconds = ScheduleService.diffInMilliseconds(
        '0 10 * * *',
        true,
      );
      clock.uninstall();

      expect(milliseconds).toBe(1000 * 60 * 60 * 2);
    });

    it('should handle bank holiday', () => {
      const clock = lolex.install({ now: new Date('2019-01-01T08:00') });
      const milliseconds = ScheduleService.diffInMilliseconds(
        '0 10 * * *',
        false,
      );
      clock.uninstall();

      expect(milliseconds).toBe(1000 * 60 * 60 * 26);
    });
  });
});
