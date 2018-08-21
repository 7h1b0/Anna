import knex from '../../knexClient';
import Ajv from 'ajv';
import aliasSchema from '../schemas/alias';

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
  return knex(TABLE)
    .first(COLUMNS)
    .where('alias_id', aliasId);
}

export function save({ sceneId, name, description, userId, enabled = true }) {
  return knex(TABLE)
    .insert({
      scene_id: sceneId,
      description,
      name,
      enabled,
      created_by: userId,
    })
    .then(([aliasId]) => {
      return {
        name,
        description,
        enabled,
        sceneId,
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
    .update({ ...payload })
    .where('alias_id', aliasId);
}
