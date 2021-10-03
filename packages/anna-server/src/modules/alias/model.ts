import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../knexClient';
import aliasSchema from './schema';
import { omit } from '../../utils/utils';

export const TABLE = 'alias';
export const COLUMNS = [
  'aliasId',
  'sceneId',
  'name',
  'description',
  'enabled',
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
  'createdBy',
];

type Alias = {
  aliasId: string;
  sceneId: string;
  name: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
};

export function validate(data: Record<string, unknown>) {
  const ajv = new Ajv();
  return ajv.validate(aliasSchema, data);
}

export async function findAll(): Promise<Alias[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(aliasId: string): Promise<Alias> {
  return knex(TABLE).first(COLUMNS).where('aliasId', aliasId);
}

export async function findByName(name: string): Promise<Alias[]> {
  return knex(TABLE).select(COLUMNS).where('name', name);
}

export async function save({
  sceneId,
  name,
  description,
  createdBy,
  enabled = true,
  startTime,
  endTime,
}: {
  sceneId: string;
  name: string;
  description: string;
  createdBy: string;
  enabled?: boolean;
  startTime?: number;
  endTime?: number;
}): Promise<string> {
  const aliasId = uuidv4();
  await knex(TABLE).insert({
    aliasId,
    sceneId,
    description,
    name,
    enabled,
    createdBy,
    startTime,
    endTime,
  });
  return aliasId;
}

export function remove(aliasId: string) {
  return knex(TABLE).where('aliasId', aliasId).del();
}

export function findByIdAndUpdate(aliasId: string, payload: Partial<Alias>) {
  const safePayload = omit(
    payload,
    'aliasId',
    'createdAt',
    'updatedAt',
    'createdBy',
  );
  return knex(TABLE).update(safePayload).where('aliasId', aliasId);
}

export function isInteger(value: unknown | number): value is number {
  return Number.isInteger(value);
}

/**
 * Given aliases, returns one alias respecting the constraints
 */
export function resolveActiveAlias(aliases: Alias[]): Alias | undefined {
  const time = new Date().getHours();
  const activeAlias = aliases
    .filter((alias) => alias.enabled)
    .filter((alias) => {
      if (isInteger(alias.startTime) && isInteger(alias.endTime)) {
        if (alias.startTime < alias.endTime) {
          return time >= alias.startTime && time < alias.endTime;
        }
        return time >= alias.startTime || time < alias.endTime;
      }
      return true;
    });

  return activeAlias.pop();
}
