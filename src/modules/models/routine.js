import Ajv from 'ajv';
import parser from 'cron-parser';
import uuidv4 from 'uuid/v4';
import knex from '../../knexClient';
import routineSchema from '../schemas/routine';
import dispatch from '../dispatch';
import { isBankHoliday } from '../utils';
import * as logger from '../logger';
import { callScene } from '../actions';

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

export function updateAllNextRunAt(routines) {
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

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(routineSchema, data);
}

export function findAll() {
  return knex(TABLE).select(COLUMNS);
}

export function findById(routineId) {
  return knex(TABLE)
    .first(COLUMNS)
    .where('routineId', routineId);
}

export async function save(
  userId,
  name,
  sceneId,
  interval,
  enabled = true,
  runAtBankHoliday = true,
) {
  const routineId = uuidv4();
  const nextRunAt = computeNextRunAt(interval, runAtBankHoliday);

  const routine = {
    routineId,
    sceneId,
    name,
    interval,
    enabled,
    runAtBankHoliday,
    createdBy: userId,
    nextRunAt,
  };

  await knex(TABLE).insert(routine);
  return routine;
}

export function remove(routineId) {
  return knex(TABLE)
    .where('routineId', routineId)
    .del();
}

export function findByIdAndUpdate(routineId, payload) {
  return knex(TABLE)
    .update(payload)
    .where('routineId', routineId);
}

export function computeNextRunAt(cron, runAtBankHoliday = true) {
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

export async function run(routine) {
  const done = (error = null) => {
    const failReason = error ? JSON.stringify(error) : null;
    const lastFailedAt = error ? new Date() : routine.lastFailedAt;
    const lastRunAt = new Date();
    const nextRunAt = computeNextRunAt(
      routine.interval,
      routine.runAtBankHoliday,
    );

    const updatedRoutine = {
      ...routine,
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
    return done(error);
  }
}
