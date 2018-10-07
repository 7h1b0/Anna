import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import roomSchema from '../schemas/room';
import knex from '../../knexClient';
import * as Dio from './dio';
import * as HueLight from './hueLight';
import { omit } from '../utils';

export const TABLE = 'rooms';
export const COLUMNS = [
  'roomId',
  'description',
  'name',
  'createdAt',
  'updatedAt',
  'createdBy',
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
    .where('roomId', id);
}

export async function save({ name, description, userId }) {
  const roomId = uuidv4();
  await knex(TABLE).insert({
    roomId,
    description,
    name,
    createdBy: userId,
  });

  return roomId;
}

export async function remove(roomId) {
  const res = await knex
    .select('roomId')
    .from(Dio.TABLE)
    .where('roomId', roomId)
    .unionAll(function() {
      this.select('roomId')
        .from(HueLight.TABLE)
        .where('roomId', roomId);
    });

  if (res.length === 0) {
    return knex(TABLE)
      .where('roomId', roomId)
      .del();
  }
  return 0;
}

export function findByIdAndUpdate(roomId, payload) {
  const safePayload = omit(payload, [
    'roomId',
    'createdAt',
    'updatedAt',
    'createdBy',
  ]);
  return knex(TABLE)
    .update(safePayload)
    .where('roomId', roomId);
}
