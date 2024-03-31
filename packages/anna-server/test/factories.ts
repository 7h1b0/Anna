import { v4 as uuidv4 } from 'uuid';
import { Routine } from '../src/modules/routine/model';

export function uuid() {
  return uuidv4();
}

export function createRoutine(options: Partial<Routine> = {}): Routine {
  const {
    routineId,
    sceneId,
    name,
    interval,
    nextRunAt,
    createdBy,
    enabled,
    runAtBankHoliday,
  } = {
    routineId: 'routineId',
    sceneId: 'sceneId',
    name: 'this_is_a_name',
    interval: '* * * * * *',
    nextRunAt: new Date(),
    createdBy: 'test',
    enabled: true,
    runAtBankHoliday: true,
    ...options,
  };
  return new Routine(
    routineId,
    sceneId,
    name,
    interval,
    nextRunAt,
    createdBy,
    enabled,
    runAtBankHoliday,
  );
}
