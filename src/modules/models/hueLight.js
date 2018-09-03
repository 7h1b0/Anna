import knex from '../../knexClient';
export const TABLE = 'lights';
export const COLUMNS = ['roomId', 'lightId'];

export function findRoomId(lightId) {
  return knex(TABLE)
    .first('roomId')
    .where('lightId', lightId);
}

export function findAll() {
  return knex(TABLE).select(...COLUMNS);
}

export function save(lightId, roomId) {
  return knex(TABLE).insert({ lightId, roomId });
}

export function remove(lightId) {
  return knex(TABLE)
    .where('lightId', lightId)
    .del();
}

export function findByIdAndUpdate(lightId, roomId) {
  return knex(TABLE)
    .update({ roomId })
    .where('lightId', lightId);
}
