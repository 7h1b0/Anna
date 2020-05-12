import Ajv from 'ajv';
import knex from '../../knexClient';
import sensorSchema from './schema';

export const TABLE = 'sensors';
export const COLUMNS = ['roomId', 'sensorId'];

export function findByRoomId(roomId: string): Promise<string[]> {
  return knex(TABLE)
    .select('sensorId')
    .where('roomId', roomId)
    .then((res) => res.map(({ sensorId }) => sensorId));
}

export function findAll() {
  return knex(TABLE).select(...COLUMNS);
}

export function remove(sensorId: string): Promise<number> {
  return knex(TABLE).where('sensorId', sensorId).del();
}

export async function insertOrUpdate(sensorId: string, roomId: string) {
  await knex.raw(
    'INSERT INTO sensors (sensorId, roomId) values (?, ?) ON DUPLICATE KEY UPDATE roomId=VALUES(roomId)',
    [sensorId, roomId],
  );
}

export function validate(data: object) {
  const ajv = new Ajv();
  return ajv.validate(sensorSchema, data);
}
