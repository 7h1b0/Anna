import knex from '../../knexClient';
import Ajv from 'ajv';
import aliasSchema from '../schemas/alias';

export const TABLE = 'alias';
export const COLUMNS = [
  'aliasId',
  'sceneId',
  'name',
  'description',
  'enabled',
  'createdAt',
  'updatedAt',
  'createdBy',
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
    .where('aliasId', aliasId);
}

export function save({ sceneId, name, description, userId, enabled = true }) {
  return knex(TABLE)
    .insert({
      sceneId,
      description,
      name,
      enabled,
      createdBy: userId,
    })
    .then(([aliasId]) => {
      return {
        name,
        description,
        enabled,
        sceneId,
        createdBy: userId,
        aliasId,
      };
    });
}

export function remove(aliasId) {
  return knex(TABLE)
    .where('aliasId', aliasId)
    .del();
}

export function findByIdAndUpdate(aliasId, payload) {
  return knex(TABLE)
    .update({ ...payload })
    .where('aliasId', aliasId);
}
