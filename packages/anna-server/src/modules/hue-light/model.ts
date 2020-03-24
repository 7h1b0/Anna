import knex from '../../knexClient';
export const TABLE = 'lights';
export const COLUMNS = ['roomId', 'lightId'];

export function findRoomId(lightId: number): Promise<string[]> {
  return knex(TABLE).first('roomId').where('lightId', lightId);
}

export function findAll() {
  return knex(TABLE).select(...COLUMNS);
}

export function findByRoomId(roomId: string): Promise<number[]> {
  return knex(TABLE)
    .select('lightId')
    .where('roomId', roomId)
    .then((res) => res.map(({ lightId }) => lightId));
}

export function remove(lightId: number): Promise<number> {
  return knex(TABLE).where('lightId', lightId).del();
}

export async function insertOrUpdate(lightId: number, roomId: string) {
  await knex.raw(
    'INSERT INTO lights (lightId, roomId) values (?, ?) ON DUPLICATE KEY UPDATE roomId=VALUES(roomId)',
    [lightId, roomId],
  );
}
