import {
  run,
  findAll,
  computeNextRunAt,
  updateAllNextRunAt,
} from '../modules/models/routine';

export const processes = new Map();

export function diffInMilliseconds(interval, runAtBankHoliday) {
  return computeNextRunAt(interval, runAtBankHoliday).getTime() - Date.now();
}

export function start(routine, execute = run) {
  stop(routine.routineId); // Insure to stop process if already exists

  if (routine.enabled !== false) {
    const process = setTimeout(() => {
      start(routine, execute);
      execute(routine);
    }, diffInMilliseconds(routine.interval, routine.runAtBankHoliday));
    processes.set(routine.routineId, process);
    return process;
  }
  return null;
}

export function stop(routineId) {
  clearTimeout(processes.get(routineId));
}

export async function load(execute) {
  const routines = await findAll();
  routines.map(routine => start(routine, execute));
  await updateAllNextRunAt(routines);
}
