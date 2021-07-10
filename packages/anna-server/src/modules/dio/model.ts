import Ajv from 'ajv';
import knex from '../../knexClient';
import dioSchema from './schema';

export const TABLE = 'dios';

export type Dio = {
  dioId: number;
  roomId: string;
  name: string;
};

export function validate(data: Record<string, unknown>) {
  const ajv = new Ajv();
  return ajv.validate(dioSchema, data);
}

export async function findAll(): Promise<Dio[]> {
  return knex(TABLE).select('dioId', 'roomId', 'name');
}

export async function findById(dioId: number): Promise<Dio> {
  return knex(TABLE).first('dioId', 'roomId', 'name').where('dioId', dioId);
}

export async function findByRoomId(roomId: string): Promise<Dio[]> {
  return knex(TABLE).select('dioId', 'roomId', 'name').where('roomId', roomId);
}

export async function save(newDio: Dio): Promise<Dio> {
  return knex(TABLE)
    .insert(newDio)
    .then(() => newDio);
}

export function remove(dioId: number) {
  return knex(TABLE).where('dioId', dioId).del();
}

export function findByIdAndUpdate(
  dioId: number,
  payload: Partial<Omit<Dio, 'dioId'>>,
) {
  return knex(TABLE).update(payload).where('dioId', dioId);
}
