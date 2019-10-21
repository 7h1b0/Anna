import Ajv from 'ajv';
import * as parser from 'cron-parser';
import uuidv4 from 'uuid/v4';
import knex from '../../knexClient';
import routineSchema from './schema';
import dispatch from 'utils/dispatch';
import { isBankHoliday, omit } from 'utils/utils';
import * as logger from 'utils/logger';
import { callScene } from 'utils/actions';

export const TABLE = 'routines';
export const COLUMNS = [
  'routineId',
  'name',
  'interval',
  'sceneId',
  'runAtBankHoliday',
  'enabled',
  'createdAt',
  'updatedAt',
  'lastFailedAt',
  'lastRunAt',
  'nextRunAt',
  'failReason',
  'createdBy',
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
    public createdAt?: number | Date,
    public updatedAt?: number | Date,
    public lastFailedAt?: number | Date,
    public lastRunAt?: number | Date,
    public failReason?: string | null,
  ) {}
}

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

export function updateAllNextRunAt(routines: Routine[]) {
  return knex.transaction(function(trx) {
    const reqs = routines.map(routine => {
      const nextRunAt = computeNextRunAt(
        routine.interval,
        routine.runAtBankHoliday,
      );

      return knex(TABLE)
        .transacting(trx)
        .update({ nextRunAt })
        .where('routineId', routine.routineId);
    });

    Promise.all(reqs)
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

export function validate(data: object) {
  const ajv = new Ajv();
  return ajv.validate(routineSchema, data);
}

export async function findAll(): Promise<Routine[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(routineId: string): Promise<Routine> {
  return knex(TABLE)
    .first(COLUMNS)
    .where('routineId', routineId);
}

export async function save(
  createdBy: string,
  name: string,
  sceneId: string,
  interval: string,
  enabled?: boolean,
  runAtBankHoliday?: boolean,
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
  );

  await knex(TABLE).insert(routine);
  return routine;
}

export async function remove(routineId: string): Promise<number> {
  return knex(TABLE)
    .where('routineId', routineId)
    .del();
}

export async function findByIdAndUpdate(
  routineId: string,
  payload: Routine,
): Promise<number> {
  return knex(TABLE)
    .update(payload)
    .where('routineId', routineId);
}

export async function run(routine: Routine) {
  const done = (error = null) => {
    const failReason = error ? JSON.stringify(error) : null;
    const lastFailedAt = error ? new Date() : routine.lastFailedAt;
    const lastRunAt = new Date();
    const nextRunAt = computeNextRunAt(
      routine.interval,
      routine.runAtBankHoliday,
    );

    const updatedRoutine = {
      ...omit(routine, 'createdAt', 'updatedAt'),
      lastRunAt,
      nextRunAt,
      failReason,
      lastFailedAt,
    };

    return findByIdAndUpdate(routine.routineId, updatedRoutine);
  };

  try {
    await dispatch(callScene(routine.sceneId));
    return done();
  } catch (error) {
    logger.error(JSON.stringify(error));
    return done(error);
  }
}
