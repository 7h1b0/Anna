import Ajv from 'ajv';
import roomSchema from '../schemas/room';
import knex from '../../knexClient';
import * as Dio from './dio';
import * as HueLight from './hueLight';

export const TABLE = 'rooms';
export const COLUMNS = [
  { roomId: 'room_id' },
  'description',
  'name',
  { createdAt: 'created_at' },
  { updatedAt: 'updated_at' },
  { createdBy: 'created_by' },
];

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(roomSchema, data);
}

export function findAll() {
  return knex(TABLE).select(COLUMNS);
}

export function findById(id) {
  return knex(TABLE)
    .first(COLUMNS)
    .where('room_id', id);
}

export function save({ name, description, userId }) {
  return knex(TABLE)
    .insert({
      description,
      name,
      created_by: userId,
    })
    .then(([roomId]) => {
      return {
        description,
        roomId,
        name,
        createdBy: userId,
      };
    });
}

export async function remove(roomId) {
  const res = await knex
    .select('room_id')
    .from(Dio.TABLE)
    .where('room_id', roomId)
    .unionAll(function() {
      this.select('room_id')
        .from(HueLight.TABLE)
        .where('room_id', roomId);
    });

  if (res.length === 0) {
    return knex(TABLE)
      .where('room_id', roomId)
      .del();
  }
  return Promise.resolve(0);
}

export function findByIdAndUpdate(roomId, payload) {
  return knex(TABLE)
    .update({ ...payload })
    .where('room_id', roomId);
}
