import {
  run,
  findAll,
  computeNextRunAt,
  updateAllNextRunAt,
  Routine,
} from 'modules/models/routine';
import * as logger from 'modules/logger';

export const processes: Map<string, NodeJS.Timeout> = new Map();

export function diffInMilliseconds(
  interval: string,
  runAtBankHoliday: boolean,
) {
  return computeNextRunAt(interval, runAtBankHoliday).getTime() - Date.now();
}

export function start(routine: Routine, execute: Function = run): void {
  stop(routine.routineId); // Insure to stop process if already exists

  if (routine.enabled !== false) {
    const process = setTimeout(() => {
      logger.info(`Launch ${routine.name}`);
      start(routine, execute);
      execute(routine);
    }, diffInMilliseconds(routine.interval, routine.runAtBankHoliday));
    processes.set(routine.routineId, process);
  }
}

export function stop(routineId: string) {
  const timeout = processes.get(routineId);
  if (timeout) {
    clearTimeout(timeout);
  }
}

export async function load(execute?: Function) {
  const routines = await findAll();
  routines.map(routine => start(routine, execute));
  await updateAllNextRunAt(routines);
}
