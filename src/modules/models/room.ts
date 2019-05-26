import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import roomSchema from '../schemas/room';
import knex from '../../knexClient';
import * as Dio from './dio';
import * as HueLight from './hueLight';

export const TABLE = 'rooms';
export const COLUMNS = [
  'roomId',
  'description',
  'name',
  'createdAt',
  'updatedAt',
  'createdBy',
];

export interface Room {
  roomId: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export function validate(data: any) {
  const ajv = new Ajv();
  return ajv.validate(roomSchema, data);
}

export async function findAll(): Promise<Room[]> {
  return knex(TABLE).select(COLUMNS);
}

export async function findById(id: string): Promise<Room> {
  return knex(TABLE)
    .first(COLUMNS)
    .where('roomId', id);
}

export async function save({
  name,
  description,
  userId,
}: {
  name: string;
  description: string;
  userId: string;
}): Promise<string> {
  const roomId = uuidv4();
  await knex(TABLE).insert({
    roomId,
    description,
    name,
    createdBy: userId,
  });

  return roomId;
}

export async function remove(roomId: string): Promise<number> {
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

export async function findByIdAndUpdate(
  roomId: string,
  payload: Partial<Room>,
): Promise<number> {
  const { roomId: ignored, ...room } = payload;
  return knex(TABLE)
    .update(room)
    .where('roomId', roomId);
}
