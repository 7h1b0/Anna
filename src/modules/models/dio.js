import Ajv from 'ajv';
import dioSchema from '../schemas/dio';
import knex from '../../knexClient';
import { returnFirst } from '../dbUtil';

export const TABLE = 'dios';

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(dioSchema, data);
}

export function findAll() {
  return knex(TABLE).select({ dioId: 'dio_id' }, { roomId: 'room_id' }, 'name');
}

export function findById(id) {
  return returnFirst(
    knex(TABLE)
      .select({ dioId: 'dio_id' }, { roomId: 'room_id' }, 'name')
      .where('dio_id', id),
  );
}

export function save({ dioId, roomId, name }) {
  return knex(TABLE)
    .insert({ dio_id: dioId, room_id: roomId, name })
    .then(() => {
      return { dioId, roomId, name };
    });
}

export function remove(dioId) {
  return knex(TABLE)
    .where('dio_id', dioId)
    .del();
}

export function findByIdAndUpdate(dioId, payload) {
  return knex(TABLE)
    .update(payload)
    .where('dio_id', dioId);
}
