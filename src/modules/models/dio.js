import Ajv from 'ajv';
import dioSchema from '../schemas/dio';
import knex from '../../knexClient';

export const TABLE = 'dios';

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(dioSchema, data);
}

export function findAll() {
  return knex(TABLE).select('dioId', 'roomId', 'name');
}

export function findById(id) {
  return knex(TABLE)
    .first('dioId', 'roomId', 'name')
    .where('dioId', id);
}

export function save({ dioId, roomId, name }) {
  return knex(TABLE)
    .insert({ dioId, roomId, name })
    .then(() => {
      return { dioId, roomId, name };
    });
}

export function remove(dioId) {
  return knex(TABLE)
    .where('dioId', dioId)
    .del();
}

export function findByIdAndUpdate(dioId, payload) {
  return knex(TABLE)
    .update(payload)
    .where('dioId', dioId);
}
