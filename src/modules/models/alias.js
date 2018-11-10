import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import knex from '../../knexClient';
import aliasSchema from '../schemas/alias';
import { omit } from '../utils';

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

export function findByName(name) {
  return knex(TABLE)
    .first(COLUMNS)
    .where('name', name);
}

export async function save({
  sceneId,
  name,
  description,
  userId,
  enabled = true,
}) {
  const aliasId = uuidv4();
  await knex(TABLE).insert({
    aliasId,
    sceneId,
    description,
    name,
    enabled,
    createdBy: userId,
  });
  return aliasId;
}

export function remove(aliasId) {
  return knex(TABLE)
    .where('aliasId', aliasId)
    .del();
}

export function findByIdAndUpdate(aliasId, payload) {
  const safePayload = omit(payload, [
    'aliasId',
    'createdAt',
    'updatedAt',
    'createdBy',
  ]);
  return knex(TABLE)
    .update(safePayload)
    .where('aliasId', aliasId);
}
