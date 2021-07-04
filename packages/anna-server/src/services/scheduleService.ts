import * as parser from 'cron-parser';
import { isBankHoliday } from '../utils/utils';
import * as logger from '../utils/logger';

export const processes: Map<string, NodeJS.Timeout> = new Map();

export function isTimestamp(time?: string) {
  return /^\d{13,}$/.test(time ?? '');
}

export function isValidCron(cron?: string): boolean {
  if (typeof cron !== 'string') {
    return false;
  }
  if (cron.length < 1) {
    return false;
  }
  try {
    parser.parseExpression(cron, {
      currentDate: new Date(),
    });
    return true;
  } catch (err) {
    return false;
  }
}

export function computeNextRunAt(time: string, runAtBankHoliday = true) {
  if (isTimestamp(time)) {
    return new Date(parseInt(time, 10));
  }

  try {
    const interval = parser.parseExpression(time, {
      currentDate: new Date(),
    });

    let nextDate = interval.next();
    if (runAtBankHoliday === false) {
      while (isBankHoliday(nextDate.toDate())) {
        nextDate = interval.next();
      }
    }
    return nextDate.toDate();
  } catch (_) {
    logger.error('Impossible to compute nextRunAt');
    return new Date();
  }
}

export function diffInMilliseconds(
  interval: string,
  runAtBankHoliday: boolean,
) {
  return computeNextRunAt(interval, runAtBankHoliday).getTime() - Date.now();
}

export function stop(id: string) {
  const timeout = processes.get(id);
  if (timeout) {
    clearTimeout(timeout);
    processes.delete(id);
  }
}

export function schedule(
  id: string,
  interval: string,
  run: (id: string) => void,
  options = { runAtBankHoliday: true },
): void {
  stop(id); // Insure to stop process if already exists

  const process = setTimeout(() => {
    logger.info(`Launch ${id}`);
    run(id);

    if (isValidCron(interval)) {
      schedule(id, interval, run, options);
    } else {
      processes.delete(id);
    }
  }, diffInMilliseconds(interval, options.runAtBankHoliday));
  processes.set(id, process);
}
