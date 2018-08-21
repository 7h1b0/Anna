import Ajv from 'ajv';
import knex from '../../knexClient';
import routineSchema from '../schemas/routine';
import { returnFirst } from '../dbUtil';

export const TABLE = 'routines';
export const COLUMNS = [
  { routineId: 'routine_id' },
  'name',
  'schedule',
  { sceneId: 'scene_id' },
  { runAtBankHoliday: 'run_at_bank_holiday' },
  'enabled',
  { createdAt: 'created_at' },
  { updatedAt: 'updated_at' },
  { failedAt: 'failed_at' },
  { lastRunAt: 'last_run_at' },
  { nextRunAt: 'next_run_at' },
  { createdBy: 'created_by' },
];

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(routineSchema, data);
}

export function findAll() {
  return knex(TABLE).select(COLUMNS);
}

export function findById(routineId) {
  return returnFirst(
    knex(TABLE)
      .select(COLUMNS)
      .where('routine_id', routineId),
  );
}

export function save(
  userId,
  name,
  sceneId,
  schedule,
  enabled = true,
  runAtBankHoliday = true,
) {
  return returnFirst(
    knex(TABLE).insert({
      scene_id: sceneId,
      name,
      schedule,
      enabled,
      run_at_bank_holiday: runAtBankHoliday,
      created_by: userId,
    }),
  );
}

export function remove(routineId) {
  return knex(TABLE)
    .where('routine_id', routineId)
    .del();
}

export function findByIdAndUpdate(routineId, payload) {
  return knex(TABLE)
    .update({ ...payload, updated_at: new Date() })
    .where('routine_id', routineId);
}
