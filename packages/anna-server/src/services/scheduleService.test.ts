import * as ScheduleService from './scheduleService';

describe('scheduleService', () => {
  afterEach(async () => {
    ScheduleService.processes.forEach((process) => clearTimeout(process));
    ScheduleService.processes.clear();
  });

  describe('computeNextRunAt', () => {
    it('should compute the next date', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2017-08-12T16:00'));
      const nextRunAt = ScheduleService.computeNextRunAt('0 12 * * *');

      expect(nextRunAt).toEqual(new Date('2017-08-13T12:00'));
    });

    it('should handle bank holiday to compute the next date', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2017-08-14T16:00'));
      const nextRunAt = ScheduleService.computeNextRunAt('0 12 * * *', false);

      expect(nextRunAt).toEqual(new Date('2017-08-16T12:00'));
    });

    it('should ignore bank holiday to compute the next date', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2017-08-14T16:00'));
      const nextRunAt = ScheduleService.computeNextRunAt('0 12 * * *', true);

      expect(nextRunAt).toEqual(new Date('2017-08-15T12:00'));
    });

    it('should return a date corresponding to the timestamp given', () => {
      const date = new Date(2019, 6, 6);
      const timestamp = `${date.getTime()}`;
      const nextRunAt = ScheduleService.computeNextRunAt(timestamp);
      expect(nextRunAt).toEqual(date);
    });
  });

  describe('isValidCron', () => {
    it.each`
      cron            | expected
      ${'0 12 * * *'} | ${true}
      ${'0 12* * *'}  | ${false}
      ${'0 * *'}      | ${false}
      ${''}           | ${false}
      ${1}            | ${false}
      ${null}         | ${false}
    `('should return $expected for $cron', ({ cron, expected }) => {
      expect(ScheduleService.isValidCron(cron)).toBe(expected);
    });
  });

  describe('schedule', () => {
    it('should schedule a new process and call it every second', () => {
      const spy = jest.fn();
      jest.useFakeTimers();
      ScheduleService.schedule('test', '* * * * * *', spy);

      jest.advanceTimersByTime(1000); // should call spy
      jest.advanceTimersByTime(1000); // should call spy for the second times

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should schedule a new process and call it every second', () => {
      const spy = jest.fn();
      jest.useFakeTimers();
      ScheduleService.schedule('test', `${Date.now() + 1000}`, spy);

      jest.advanceTimersByTime(1000); // should call spy
      jest.advanceTimersByTime(1000); // should do nothing

      expect(spy).toHaveBeenCalledTimes(1);
      expect(ScheduleService.processes.size).toBe(0);
    });

    it('should stop process with the same id', () => {
      jest.useFakeTimers();
      ScheduleService.schedule('test', '* * * * * *', jest.fn());
      ScheduleService.schedule('test', '* * * * * *', jest.fn());

      expect(jest.getTimerCount()).toBe(1);
    });
  });

  describe('stop', () => {
    it('should stop an existing process', () => {
      jest.useFakeTimers();
      ScheduleService.schedule('test', '0 12 * * * *', jest.fn());

      expect(jest.getTimerCount()).toBe(1);
      ScheduleService.stop('test');
      expect(jest.getTimerCount()).toBe(0);
      expect(ScheduleService.processes.size).toBe(0);
    });

    it('should do nothing if id is unknown', () => {
      jest.useFakeTimers();
      ScheduleService.schedule('test', '* * * * * *', jest.fn());

      expect(jest.getTimerCount()).toBe(1);
      ScheduleService.stop('unknow');
      expect(jest.getTimerCount()).toBe(1);
    });
  });

  describe('diffInMilliseconds', () => {
    it('should return the diff between the next run at and now', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2019-01-01T08:00'));
      const milliseconds = ScheduleService.diffInMilliseconds(
        '0 10 * * *',
        true,
      );

      expect(milliseconds).toBe(1000 * 60 * 60 * 2);
    });

    it('should handle bank holiday', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2019-01-01T08:00'));
      const milliseconds = ScheduleService.diffInMilliseconds(
        '0 10 * * *',
        false,
      );

      expect(milliseconds).toBe(1000 * 60 * 60 * 26);
    });
  });
});
