import knex from '../../knexClient';
export const TABLE = 'lights';
export const COLUMNS = [{ roomId: 'room_id' }, { lightId: 'light_id' }];

export function findRoomId(lightId) {
  return knex(TABLE)
    .first({ roomId: 'room_id' })
    .where('light_id', lightId);
}

export function findAll() {
  return knex(TABLE).select(...COLUMNS);
}

export function save(lightId, roomId) {
  return knex(TABLE).insert({ light_id: lightId, room_id: roomId });
}

export function remove(lightId) {
  return knex(TABLE)
    .where('light_id', lightId)
    .del();
}

export function findByIdAndUpdate(lightId, roomId) {
  return knex(TABLE)
    .update({ room_id: roomId })
    .where('light_id', lightId);
}
