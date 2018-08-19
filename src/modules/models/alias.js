import knex from '../../knexClient';
import Ajv from 'ajv';
import aliasSchema from '../schemas/alias';
import { returnFirst } from '../dbUtil';

export const TABLE = 'alias';
export const COLUMNS = [
  { aliasId: 'alias_id' },
  { sceneId: 'scene_id' },
  'name',
  'description',
  'enabled',
  { createdAt: 'created_at' },
  { updatedAt: 'updated_at' },
  { createdBy: 'created_by' },
];

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(aliasSchema, data);
}

export function findAll() {
  return knex(TABLE).select(COLUMNS);
}

export function findById(aliasId) {
  return returnFirst(
    knex(TABLE)
      .select(COLUMNS)
      .where('alias_id', aliasId),
  );
}

export function save({ sceneId, name, description, userId, enabled = true }) {
  const date = new Date();
  return knex(TABLE)
    .insert({
      scene_id: sceneId,
      description,
      name,
      enabled,
      created_by: userId,
      updated_at: date,
      created_at: date,
    })
    .then(([aliasId]) => {
      return {
        name,
        description,
        enabled,
        sceneId,
        createdAt: date,
        updatedAt: date,
        createdBy: userId,
      };
    });
}

export function remove(aliasId) {
  return knex(TABLE)
    .where('alias_id', aliasId)
    .del();
}

export function findByIdAndUpdate(aliasId, payload) {
  return knex(TABLE)
    .update({ ...payload, updated_at: new Date() })
    .where('alias_id', aliasId);
}
