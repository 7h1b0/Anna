import knex from '../../knexClient';
export const TABLE = 'lights';
export const COLUMNS = ['roomId', 'lightId'];

export function findRoomId(lightId: number) {
  return knex(TABLE)
    .first('roomId')
    .where('lightId', lightId);
}

export function findAll() {
  return knex(TABLE).select(...COLUMNS);
}

export function save(lightId: number, roomId: string) {
  return knex(TABLE).insert({ lightId, roomId });
}

export function remove(lightId: number) {
  return knex(TABLE)
    .where('lightId', lightId)
    .del();
}

export function findByIdAndUpdate(lightId: number, roomId: string) {
  return knex(TABLE)
    .update({ roomId })
    .where('lightId', lightId);
}
