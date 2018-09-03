import knex from '../../knexClient';
export const TABLE = 'logs';
export const COLUMNS = ['ip', 'httpMethod', 'path', 'createdAt', 'username'];

export function save({ httpMethod, path, ip, username }) {
  return knex(TABLE).insert({
    httpMethod,
    path,
    ip,
    username,
  });
}

export function findWithLimit(limit) {
  return knex(TABLE)
    .select(...COLUMNS)
    .orderBy('id', 'desc')
    .limit(limit);
}
