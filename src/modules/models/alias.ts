import * as Ajv from 'ajv';
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

interface Alias {
  aliasId: string;
  sceneId: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt: number;
  updateAt: number;
  createdBy: string;
}

export function validate(data: object) {
  const ajv = new Ajv();
  return ajv.validate(aliasSchema, data);
}

export async function findAll(): Promise<Alias[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(aliasId: string): Promise<Alias> {
  return knex(TABLE)
    .first(COLUMNS)
    .where('aliasId', aliasId);
}

export async function findByName(name: string): Promise<Alias> {
  return knex(TABLE)
    .first(COLUMNS)
    .where('name', name);
}

export async function save({
  sceneId,
  name,
  description,
  createdBy,
  enabled = true,
}: {
  sceneId: string;
  name: string;
  description: string;
  createdBy: string;
  enabled?: boolean;
}): Promise<string> {
  const aliasId = uuidv4();
  await knex(TABLE).insert({
    aliasId,
    sceneId,
    description,
    name,
    enabled,
    createdBy,
  });
  return aliasId;
}

export function remove(aliasId: string) {
  return knex(TABLE)
    .where('aliasId', aliasId)
    .del();
}

export function findByIdAndUpdate(aliasId: string, payload: object) {
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
