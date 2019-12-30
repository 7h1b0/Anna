import {
  run,
  findAll,
  computeNextRunAt,
  updateAllNextRunAt,
  Routine,
} from 'modules/routine/model';
import * as logger from 'utils/logger';

export const processes: Map<string, NodeJS.Timeout> = new Map();

export function diffInMilliseconds(
  interval: string,
  runAtBankHoliday: boolean,
) {
  return computeNextRunAt(interval, runAtBankHoliday).getTime() - Date.now();
}

export function stop(routineId: string) {
  const timeout = processes.get(routineId);
  if (timeout) {
    clearTimeout(timeout);
  }
}

export function start(routine: Routine): void {
  stop(routine.routineId); // Insure to stop process if already exists

  if (routine.enabled !== false) {
    const process = setTimeout(() => {
      logger.info(`Launch ${routine.name}`);
      start(routine);
      run(routine);
    }, diffInMilliseconds(routine.interval, routine.runAtBankHoliday));
    processes.set(routine.routineId, process);
  }
}

export async function load() {
  const routines = await findAll();
  routines.map(routine => start(routine));
  await updateAllNextRunAt(routines);
}
