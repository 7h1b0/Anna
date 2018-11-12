import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import { CronTime } from 'cron';
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
  const nextRunAt = computeNextRunAt({ interval, runAtBankHoliday });

  await knex(TABLE).insert({
    routineId,
    sceneId,
    name,
    interval,
    enabled,
    runAtBankHoliday,
    createdBy: userId,
    nextRunAt,
  });

  return routineId;
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

export function computeNextRunAt(routine) {
  const getDateWithOffset = timestamp => new Date(timestamp + 10000);

  const currentDateOffset = getDateWithOffset(Date.now());

  try {
    const cronTime = new CronTime(routine.interval);
    let nextDate = cronTime._getNextDateFrom(currentDateOffset);

    if (routine.runAtBankHoliday === false && isBankHoliday(nextDate)) {
      const nextDateOffset = getDateWithOffset(nextDate);
      nextDate = cronTime._getNextDateFrom(nextDateOffset);
    }

    return nextDate.toDate();
  } catch (e) {
    logger.error(e);
    return undefined;
  }
}

export async function run(routine) {
  if (routine.runAtBankHoliday === false && isBankHoliday(Date.now())) {
    return;
  }

  const done = (error = null) => {
    const failReason = error ? JSON.stringify(error) : null;
    const lastFailedAt = error ? new Date() : routine.lastFailedAt;
    const lastRunAt = new Date();
    const nextRunAt = computeNextRunAt(routine);

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
