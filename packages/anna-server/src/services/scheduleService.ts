import * as parser from 'cron-parser';
import { isBankHoliday } from 'utils/utils';
import * as logger from 'utils/logger';

export const processes: Map<string, NodeJS.Timeout> = new Map();

export function computeNextRunAt(cron: string, runAtBankHoliday = true) {
  try {
    const interval = parser.parseExpression(cron, {
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
    schedule(id, interval, run, options);
  }, diffInMilliseconds(interval, options.runAtBankHoliday));
  processes.set(id, process);
}
