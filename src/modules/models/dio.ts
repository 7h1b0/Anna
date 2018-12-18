import * as Ajv from 'ajv';
import dioSchema from '../schemas/dio';
import knex from '../../knexClient';

export const TABLE = 'dios';

export interface Dio {
  dioId: number;
  roomId: string;
  name: string;
}

export function validate(data: object) {
  const ajv = new Ajv();
  return ajv.validate(dioSchema, data);
}

export async function findAll(): Promise<Dio[]> {
  return knex(TABLE).select('dioId', 'roomId', 'name');
}

export async function findById(id: string): Promise<Dio> {
  return knex(TABLE)
    .first('dioId', 'roomId', 'name')
    .where('dioId', id);
}

export function save(newDio: Dio) {
  return knex(TABLE)
    .insert(newDio)
    .then(() => {
      return newDio;
    });
}

export function remove(dioId: number) {
  return knex(TABLE)
    .where('dioId', dioId)
    .del();
}

export function findByIdAndUpdate(
  dioId: number,
  payload: Pick<Dio, Exclude<keyof Dio, 'dioId'>>,
) {
  return knex(TABLE)
    .update(payload)
    .where('dioId', dioId);
}
