import { run, findAll } from '../modules/models/routine';
import { CronJob } from 'cron';

export const processes = new Map();

export function start(routine, callback = run) {
  stop(routine.routineId); // Insure to stop process if already exists

  if (routine.enabled !== false) {
    const process = new CronJob(
      routine.interval,
      () => callback(routine),
      null,
      true,
    );
    processes.set(routine.routineId, process);
    return process;
  }
  return null;
}

export function stop(routineId) {
  const process = processes.get(routineId);
  if (process) {
    process.stop();
  }
}

export async function load(callback) {
  const routines = await findAll();
  return routines.map(routine => start(routine, callback));
}
