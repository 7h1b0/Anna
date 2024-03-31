import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../knexClient';
import routineSchema from './schema';
import {
  computeNextRunAt,
  isValidCron,
  isTimestamp,
} from '../../services/scheduleService';
import * as ScheduleService from '../../services/scheduleService';
import dispatch from '../../utils/dispatch';
import { omit } from '../../utils/utils';
import { fetchIsAway } from '../config/model';
import * as logger from '../../utils/logger';
import { callScene } from '../../utils/actions';

export const TABLE = 'routines';
export const COLUMNS = [
  'routineId',
  'name',
  'interval',
  'sceneId',
  'runAtBankHoliday',
  'runWhenAway',
  'enabled',
  'createdAt',
  'updatedAt',
  'lastRunAt',
  'nextRunAt',
  'createdBy',
  'lastStatus',
];

export class Routine {
  constructor(
    public routineId: string,
    public sceneId: string,
    public name: string,
    public interval: string,
    public nextRunAt: number | Date,
    public createdBy: string,
    public enabled = true,
    public runAtBankHoliday = true,
    public runWhenAway = false,
    public createdAt?: number | Date,
    public updatedAt?: number | Date,
    public lastRunAt?: number | Date,
    public lastStatus?: string,
  ) {}
}

export function updateAllNextRunAt(routines: Routine[]) {
  return knex.transaction(function (trx) {
    const reqs = routines.map((routine) => {
      const nextRunAt = computeNextRunAt(
        routine.interval,
        routine.runAtBankHoliday,
      );

      return knex(TABLE)
        .transacting(trx)
        .update({ nextRunAt })
        .where('routineId', routine.routineId);
    });

    Promise.all(reqs).then(trx.commit).catch(trx.rollback);
  });
}

export function validate(data: Partial<Routine>) {
  const ajv = new Ajv();
  const isValid = ajv.validate(routineSchema, data);
  if (isValidCron(data.interval)) {
    return isValid;
  } else if (isTimestamp(data.interval)) {
    return isValid && parseInt(data.interval ?? '', 10) > Date.now();
  }
  return false;
}

export async function findAll(): Promise<Routine[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(routineId: string): Promise<Routine> {
  return knex(TABLE).first(COLUMNS).where('routineId', routineId);
}

export async function save(
  createdBy: string,
  name: string,
  sceneId: string,
  interval: string,
  enabled?: boolean,
  runAtBankHoliday?: boolean,
  ddrunWhenAway?: boolean,
) {
  const routineId = uuidv4();
  const nextRunAt = computeNextRunAt(interval, runAtBankHoliday);

  const routine = new Routine(
    routineId,
    sceneId,
    name,
    interval,
    nextRunAt,
    createdBy,
    enabled,
    runAtBankHoliday,
    ddrunWhenAway,
  );

  await knex(TABLE).insert(routine);
  return routine;
}

export async function remove(routineId: string): Promise<number> {
  return knex(TABLE).where('routineId', routineId).del();
}

export async function findByIdAndUpdate(
  routineId: string,
  payload: Routine,
): Promise<number> {
  const nextRunAt = computeNextRunAt(
    payload.interval,
    payload.runAtBankHoliday,
  );

  const updatedPayload = Object.assign({}, payload, { nextRunAt });
  return knex(TABLE).update(updatedPayload).where('routineId', routineId);
}

export async function run(routine: Routine) {
  const done = (status: 'success' | 'failed' | 'skipped') => {
    const lastRunAt = new Date();

    const updatedRoutine = {
      ...omit(routine, 'createdAt', 'updatedAt'),
      lastRunAt,
      lastStatus: status,
    };

    return findByIdAndUpdate(routine.routineId, updatedRoutine);
  };

  try {
    const { runWhenAway } = routine;
    const isAway = await fetchIsAway();

    if (isAway && !runWhenAway) {
      return done('skipped');
    }

    await dispatch(callScene(routine.sceneId));
    return done('success');
  } catch (error) {
    logger.error(JSON.stringify(error));
    return done('failed');
  }
}

export function schedule(routine: Routine): void {
  ScheduleService.stop(routine.routineId); // Insure to stop process if already exists

  if (routine.enabled !== false) {
    ScheduleService.schedule(
      routine.routineId,
      routine.interval,
      () => run(routine),
      { runAtBankHoliday: routine.runAtBankHoliday },
    );
  }
}

export async function load() {
  const routines = await findAll();
  routines.map((routine) => schedule(routine));
  await updateAllNextRunAt(routines);
}
